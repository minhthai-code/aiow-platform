/**
 * NavigationController v2 — uses REAL exported API of each system module.
 *
 * System D: navCache.save() / navCache.get()
 * System B: navPredictor.record() / navPredictor.predict()
 * System F: routerTracer spans
 * System H: perfBudget.markRenderStart() / markRenderEnd()
 * ErrorBoundary per route
 */

import { emit } from '@core/runtime-api/event-bus';
import type { RouteDefinition, RouteParams, Unmount, NavigationContext } from '@core/types';
import { createNoopRouterHooks, type RouterHooks } from './router-hooks';

// ── Helpers ───────────────────────────────────────────────

function compilePath(p: string): RegExp {
  return new RegExp('^' + p.replace(/:[a-zA-Z]+/g, '([^/]+)').replace(/\//g, '\\/') + '$');
}

function extractPathParams(pattern: string, pathname: string): RouteParams {
  const keys: string[] = [];
  const re = /:([a-zA-Z]+)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(pattern)) !== null) if (m[1]) keys.push(m[1]);
  const vals = compilePath(pattern).exec(pathname);
  const out: Record<string, string> = {};
  keys.forEach((k, i) => { if (vals?.[i + 1]) out[k] = vals[i + 1]!; });
  return out;
}

function parseQuery(s: string): Record<string, string> {
  const out: Record<string, string> = {};
  if (!s) return out;
  new URLSearchParams(s).forEach((v, k) => { out[k] = v; });
  return out;
}

interface Match { route: RouteDefinition; params: RouteParams; }

// ── Controller ────────────────────────────────────────────

export class NavigationController {
  private readonly routes   : RouteDefinition[] = [];
  private readonly patterns = new Map<RouteDefinition, RegExp>();
  private readonly hooks: RouterHooks;
  private outlet:       HTMLElement | null = null;
  private currentPath   = '';
  private storeState:   unknown = null;

  constructor(hooks: RouterHooks = createNoopRouterHooks()) {
    this.hooks = hooks;
  }

  register(route: RouteDefinition): void {
    this.routes.push(route);
    this.patterns.set(route, compilePath(route.path));
  }

  boot(outlet: HTMLElement): void {
    this.outlet = outlet;
    document.addEventListener('click',     this._click.bind(this));
    window.addEventListener('popstate',    this._pop.bind(this));
    document.addEventListener('mouseover', this._hover.bind(this));
    document.addEventListener('mouseout',  () => this.hooks.prefetch.cancelHoverPrefetch());
    this._go(location.pathname + location.search, 'replace');
  }

  push(url: string):    void { this._go(url, 'push'); }
  replace(url: string): void { this._go(url, 'replace'); }
  setStoreState(s: unknown): void { this.storeState = s; }

  private _click(e: MouseEvent): void {
    const a = (e.target as Element).closest('a');
    if (!a) return;
    const href = a.getAttribute('href');
    if (!href?.startsWith('/')) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if ((a as HTMLAnchorElement).target === '_blank') return;
    e.preventDefault();
    this._go(href, 'push');
  }

  private _pop(): void { this._go(location.pathname + location.search, 'pop'); }

  private _hover(e: Event): void {
    const a    = (e.target as Element).closest('a');
    const href = a?.getAttribute('href');
    if (!href?.startsWith('/')) return;
    const q    = href.indexOf('?');
    const path = q >= 0 ? href.slice(0, q) : href;
    const m    = this._match(path);
    if (m) this.hooks.prefetch.prefetchOnHover(m.route.chunkId, m.route.load);
  }

  private async _go(url: string, mode: 'push' | 'replace' | 'pop'): Promise<void> {
    const qi       = url.indexOf('?');
    const pathname = (qi >= 0 ? url.slice(0, qi) : url) || '/';
    const search   = qi >= 0 ? url.slice(qi + 1) : '';
    const fullPath = pathname + (search ? '?' + search : '');

    if (fullPath === this.currentPath) return;
    const match = this._match(pathname);
    const params: RouteParams = {
      ...extractPathParams(match?.route.path ?? '', pathname),
      ...parseQuery(search),
    };

    const ctx: NavigationContext = {
      from:      this.currentPath,
      to:        fullPath,
      params,
      timestamp: Date.now(),
      traceId:   'engine',
    };

    emit('route:will-change', ctx);

    this.currentPath = fullPath;
    if (mode === 'push')    history.pushState({ path: fullPath }, '', fullPath);
    if (mode === 'replace') history.replaceState({ path: fullPath }, '', fullPath);
    emit('route:changed', ctx);

    if (!this.outlet) return;

    await this.hooks.onNavigate({
      from: ctx.from,
      to: fullPath,
      mode,
      params,
      container: this.outlet,
      route: match?.route,
      cachedState: null,
    });
  }

  private _match(pathname: string): Match | null {
    for (const route of this.routes) {
      if (this.patterns.get(route)!.test(pathname))
        return { route, params: extractPathParams(route.path, pathname) };
    }
    return null;
  }

  // Router no longer owns activation/mount/rendering.
  // Execution continues only via RouterHooks.onNavigate -> PlatformEngine.
}
