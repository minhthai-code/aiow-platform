import type { RouteDefinition, RouteParams, NavigationContext, Unmount } from '@core/types';
import type { Span } from '@platform/tracing/tracing';
import type { NavigationIntent } from '@platform/engine/engine-events';

export type RouterSpan = Span;

export interface RouterTracing {
  startSpan(name: string, meta?: Record<string, string | number | boolean>): RouterSpan;
  endSpan(span: RouterSpan, err?: Error): void;
}

export interface RouterTelemetry {
  recordNavigation(from: string, to: string, durationMs: number): void;
}

export interface RouterPrefetch {
  prefetchOnHover(chunkId: string, loader: RouteDefinition['load']): void;
  cancelHoverPrefetch(): void;
}

export interface RouterNavCache {
  save(path: string, snapshot: { state: unknown; scrollY: number }): void;
  get(path: string): { state: unknown; scrollY: number } | null;
}

export interface RouterNavPredictor {
  record(from: string, to: string): void;
  predict(path: string): Array<{ path: string; confidence: number }>;
}

export interface RouterPerfBudget {
  markRenderStart(chunkId: string): void;
  markRenderEnd(chunkId: string, phase: 'first-render' | 'update'): void;
}

export interface RouterErrorBoundaryRunner {
  run<T>(
    opts: { featureId: string; container: HTMLElement; onRetry: () => void },
    work: () => Promise<T>,
  ): Promise<T | null>;
}

export interface RouterHooks {
  tracing: RouterTracing;
  telemetry: RouterTelemetry;
  prefetch: RouterPrefetch;
  navCache: RouterNavCache;
  navPredictor: RouterNavPredictor;
  perfBudget: RouterPerfBudget;
  errorBoundary: RouterErrorBoundaryRunner;

  onNavigate: (intent: NavigationIntent) => Promise<void>;

  // Optional: v7 rendering orchestration (wraps mount without changing feature contract)
  render?: {
    mountFeature: (args: {
      container: HTMLElement;
      route: RouteDefinition;
      params: RouteParams;
      ctx: NavigationContext;
      cachedState: unknown;
      mount: (container: HTMLElement, params: RouteParams) => Unmount;
    }) => Unmount;
  };
}

export function createNoopRouterHooks(): RouterHooks {
  return {
    tracing: {
      startSpan: () => ({
        traceId: 'noop',
        spanId: 'noop',
        name: 'noop',
        startMs: 0,
        attrs: {},
        status: 'ok',
      }),
      endSpan: () => {},
    },
    telemetry: { recordNavigation: () => {} },
    prefetch: { prefetchOnHover: () => {}, cancelHoverPrefetch: () => {} },
    navCache: { save: () => {}, get: () => null },
    navPredictor: { record: () => {}, predict: () => [] },
    perfBudget: { markRenderStart: () => {}, markRenderEnd: () => {} },
    errorBoundary: { run: async (_opts, work) => await work() },
    onNavigate: async () => {},
  };
}

