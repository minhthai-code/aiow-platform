import '@libs/components/layout/yt-header';
import '@libs/components/layout/yt-rail';
import '@libs/components/layout/yt-sidebar';
import '@platform/runtime/app-shell';

import { router } from '@platform/runtime/platform-router';
import { loadProduct } from '@platform/runtime/product-loader';
import { getRoutesForProduct } from '@platform/runtime/route-registry';

import { NavigationController }     from '@core/router/router';
import { registerService }          from '@core/runtime-api/platform-element';
import { ApiClient }                from '@platform/api-client/client';
import { AuthService }              from '@platform/auth/auth-service';
import { emit }                     from '@core/runtime-api/event-bus';
import { init as initTelemetry }    from '@platform/telemetry/telemetry';
import { initExperiments }          from '@platform/experiments/experiment-engine';
import { initTheme }                from '@libs/tokens/tokens';
import { platformLogger }           from '@core/platform-logger/logger';
import { fetchAndVerifyManifest }   from '@core/integrity/manifest-integrity';
import { canaryController }         from '@platform/manifest/rollout-manager';
import { hydrationManager }         from '@core/hydration/hydration-manager';
import { initTracing, routerTracer } from '@platform/tracing/tracing';
import type { AppShell }            from '@platform/runtime/app-shell';
import { EntityStore, InvalidationManager, QueryClient } from '@data-graph/index';
import { NetworkScheduler } from '@scheduling/network/network-scheduler';

// Inject CSS tokens immediately
initTheme();

// Services
const networkScheduler = new NetworkScheduler(8);
registerService('NetworkScheduler', networkScheduler);

const api  = new ApiClient({ baseUrl: '/youtubei/v1' });
const auth = new AuthService(api);
registerService('ApiClient',   api);
registerService('AuthService', auth);

// v7 Data Graph (additive, not yet used by features)
const entityStore = new EntityStore();
const invalidation = new InvalidationManager();
const dataGraph = new QueryClient(entityStore, invalidation);
registerService('DataGraph', dataGraph);

// Expose router as platform service
registerService<NavigationController>('Router', router);

window.addEventListener('offline', () => emit('network:offline', {}));
window.addEventListener('online',  () => emit('network:online',  {}));

async function boot(): Promise<void> {
  const t0 = performance.now();

  initTracing();

  if (typeof PerformanceObserver !== 'undefined') {
    try {
      new PerformanceObserver(list => {
        for (const entry of list.getEntries()) {
          if (entry.duration >= 50) {
            platformLogger.warn('Long task detected', {
              duration: Math.round(entry.duration),
              start:    Math.round(entry.startTime),
            });
          }
        }
      }).observe({ type: 'longtask', buffered: true });
    } catch { /* longtask not supported everywhere */ }
  }

  initTelemetry();

  fetchAndVerifyManifest().then(result => {
    if (result && !result.ok) {
      platformLogger.warn('Manifest integrity failed', { reason: result.reason });
    }
  }).catch(() => { /* non-fatal */ });

  const authState = await auth.initialize();
  emit('auth:changed', authState);

  initExperiments(authState.userId);
  canaryController.init(authState.userId);

  await customElements.whenDefined('yt-app');
  const appEl = document.querySelector('yt-app') as AppShell | null;
  if (!appEl) throw new Error('<yt-app> not found in DOM');
  await appEl.updateComplete;

  // Load initial product and register its routes
  await loadProduct('youtube');
  const routes = getRoutesForProduct('youtube');
  for (const route of routes) {
    router.register(route);
  }

  router.boot(appEl.getOutlet());

  hydrationManager.hydrateFromDOM(new Map());

  if (!import.meta.env.DEV && 'serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js', { scope: '/', updateViaCache: 'none' })
      .catch(e => platformLogger.warn('SW registration failed', { e: String(e) }));
  }

  const ms = Math.round(performance.now() - t0);
  platformLogger.info('Platform ready', { ms });
  console.log(`%c[YTube] ✓ ${ms}ms`, 'color:#ff0000;font-weight:bold;font-size:13px');

  if (import.meta.env.DEV) {
    (window as unknown as Record<string, unknown>)['__ytube__'] = { router, api, canaryController, routerTracer };
  }
}

boot().catch(err => {
  console.error('[PlatformRuntime] Fatal:', err);
  document.getElementById('root')!.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:center;height:100vh;
                font-family:Inter,sans-serif;background:var(--bg-base,#090909);color:var(--tx-1,#f0f0f0)">
      <div style="text-align:center;padding:40px">
        <h2 style="margin-bottom:10px;font-size:20px">Failed to start</h2>
        <p style="color:var(--tx-2,#888);font-size:13px;margin-bottom:20px;max-width:360px">${String(err)}</p>
        <button onclick="location.reload()"
          style="padding:10px 28px;background:#ff0000;color:#fff;border:none;
                 border-radius:8px;cursor:pointer;font-size:14px;font-weight:600">Retry</button>
      </div>
    </div>`;
});

