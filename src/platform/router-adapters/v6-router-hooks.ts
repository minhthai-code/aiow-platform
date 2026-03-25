import type { RouterHooks } from '@core/router/router-hooks';
import { recordNavigation } from '@platform/telemetry/telemetry';
import { prefetchOnHover, cancelHoverPrefetch } from '@platform/prefetch/prefetch-engine';
import { ErrorBoundary } from '@platform/error-boundary/error-boundary';
import { navCache } from '@platform/navigation-cache/navigation-cache';
import { navPredictor } from '@platform/nav-predictor/nav-predictor';
import { routerTracer } from '@platform/tracing/tracing';
import { perfBudget } from '@platform/performance-budget/performance-budget';
import type { RouteDefinition } from '@core/types';
import { DefaultRenderManager } from '@rendering/engine/render-manager';

export function createV6RouterHooks(): RouterHooks {
  const renderManager = new DefaultRenderManager();
  return {
    tracing: {
      startSpan: (name, meta) => routerTracer.startSpan(name, meta),
      endSpan: (span, err) => routerTracer.endSpan(span, err),
    },
    telemetry: {
      recordNavigation: (from, to, durationMs) => recordNavigation(from, to, durationMs),
    },
    prefetch: {
      prefetchOnHover: (chunkId: string, loader: RouteDefinition['load']) => prefetchOnHover(chunkId, loader),
      cancelHoverPrefetch: () => cancelHoverPrefetch(),
    },
    navCache: {
      save: (path, snapshot) => navCache.save(path, snapshot),
      get: (path) => navCache.get(path),
    },
    navPredictor: {
      record: (from, to) => navPredictor.record(from, to),
      predict: (path) => navPredictor.predict(path),
    },
    perfBudget: {
      markRenderStart: (chunkId) => perfBudget.markRenderStart(chunkId),
      markRenderEnd: (chunkId, phase) => perfBudget.markRenderEnd(chunkId, phase),
    },
    errorBoundary: {
      run: async (opts, work) => {
        const boundary = new ErrorBoundary({
          featureId: opts.featureId,
          container: opts.container,
          onRetry: opts.onRetry,
        });
        return await boundary.run(work);
      },
    },
    onNavigate: async () => {
      // Deferred: v6 router orchestrates navigation; v8 engine will replace this hook.
    },
    render: {
      mountFeature: ({ container, route, params, ctx, cachedState, mount }) => {
        // v7 hook point: allow phased orchestration without changing feature semantics.
        // For now, keep behavior identical and execute a no-op plan.
        void renderManager.scheduleRender({ outlet: container, plan: { routeId: route.path, slots: [] } });
        return mount(container, params);
      },
    },
  };
}

