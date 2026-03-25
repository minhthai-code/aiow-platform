import type { RouteDefinition, Unmount } from '@core/types';
import { getRegisteredService } from '@core/runtime-api/platform-element';
import {
  createEngineEventEmitter,
  NAVIGATION_CANCEL,
  NAVIGATION_COMPLETE,
  NAVIGATION_START,
  type EngineEventEmitter,
  type NavigationIntent,
} from './engine-events';
import { ExecutionContext } from './execution-context';
import type { ExecutionPlan } from './execution-plan';
import { platformLogger } from '@core/platform-logger/logger';
import { NavigationPlanner } from './planner/navigation-planner';
import { DataDependencyPlanner } from './planner/data-dependency-planner';
import { RenderPhasePlanner } from './planner/render-phase-planner';
import type { NetworkRequestDescriptor, NetworkScheduler } from '@scheduling/network/network-scheduler';

export interface ScheduledTask<T> {
  readonly type: 'network' | 'cpu';
  readonly priority: 'critical' | 'high' | 'normal' | 'low' | 'idle';
  readonly task: (signal: AbortSignal) => Promise<T>;
  readonly signal?: AbortSignal;
  readonly id: string;
  readonly url?: string;
}

export interface QueryExecutor {
  execute(query: { key: string }, signal: AbortSignal): Promise<unknown>;
}

function ensureNotAborted(signal: AbortSignal): void {
  if (!signal.aborted) return;
  throw new DOMException('Aborted', 'AbortError');
}

export class PlatformEngine {
  private readonly events: EngineEventEmitter;
  private active?: { ctx: ExecutionContext; plan: ExecutionPlan; unmount: Unmount | null };
  private readonly navigationPlanner = new NavigationPlanner();
  private readonly dataPlanner = new DataDependencyPlanner();
  private readonly renderPhasePlanner = new RenderPhasePlanner();
  private readonly queryExecutor: QueryExecutor | null;

  constructor(input?: { events?: EngineEventEmitter; queryExecutor?: QueryExecutor | null }) {
    this.events = input?.events ?? createEngineEventEmitter();
    this.queryExecutor = input?.queryExecutor ?? null;
  }

  get emitter(): EngineEventEmitter {
    return this.events;
  }

  get activeExecutionId(): string | undefined {
    return this.active?.ctx.executionId;
  }

  private getScheduler(): NetworkScheduler {
    return getRegisteredService<NetworkScheduler>('NetworkScheduler');
  }

  private schedule<T>(scheduler: NetworkScheduler, t: ScheduledTask<T>): Promise<T> {
    const desc: NetworkRequestDescriptor = {
      id: t.id,
      priority: t.priority,
      url: t.url,
      signal: t.signal,
    };
    // NOTE: We currently have a single scheduler implementation (network).
    // CPU tasks are routed through it for the Step 5 invariant.
    return scheduler.schedule(desc, async (signal) => {
      ensureNotAborted(signal);
      return await t.task(signal);
    });
  }

  async navigate(intent: NavigationIntent): Promise<void> {
    const previous = this.active?.ctx;
    const previousUnmount = this.active?.unmount ?? null;
    const scheduler = this.getScheduler();
    const nav = this.navigationPlanner.plan(intent);
    const queries = this.dataPlanner.plan(nav.route);
    const renderPhases = this.renderPhasePlanner.plan(nav.route);
    const plan: ExecutionPlan = { route: nav.route, params: nav.params, queries, renderPhases };

    const ctx = new ExecutionContext({ route: nav.route, params: nav.params, container: intent.container });

    if (previous && !previous.isCancelled) {
      previous.cancel();
      this.events.emit(NAVIGATION_CANCEL, {
        executionId: previous.executionId,
        replacedByExecutionId: ctx.executionId,
        reason: 'superseded',
        cancelledAt: Date.now(),
      });
    }

    if (previousUnmount) {
      try { previousUnmount(); } catch { /* isolate unmount */ }
    }

    this.active = { ctx, plan, unmount: null };
    this.events.emit(NAVIGATION_START, {
      executionId: ctx.executionId,
      intent,
      startedAt: ctx.startTime,
    });

    for (const q of plan.queries) {
      void this.schedule(scheduler, {
        type: 'network',
        priority: q.priority,
        id: `query:${ctx.executionId}:${q.key}`,
        signal: ctx.signal,
        task: async (signal) => {
          ensureNotAborted(signal);
          if (!this.queryExecutor) return;
          await this.queryExecutor.execute(q, signal);
        },
      }).catch((err: unknown) => {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        platformLogger.warn('Query failed during navigation', {
          queryKey: q.key,
          executionId: ctx.executionId,
          error: String(err),
        });
      });
    }

    let unmount: Unmount | null = null;
    try {
      if (!nav.route) {
        ctx.container.innerHTML = `
          <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;
                      min-height:60vh;color:var(--tx-1,#f0f0f0);text-align:center;padding:48px;font-family:var(--font,sans-serif)">
            <div style="font-size:96px;font-weight:700;color:var(--bg-overlay,#252525);line-height:1;margin-bottom:16px">404</div>
            <h2 style="font-size:22px;font-weight:500;margin-bottom:8px">Page not found</h2>
            <p style="color:var(--tx-2,#888);margin-bottom:24px">This page doesn't exist or was removed.</p>
            <button onclick="history.back()"
              style="padding:10px 28px;background:var(--bg-raised,#1c1c1c);color:var(--tx-1,#f0f0f0);
                     border:1px solid var(--bd-1,rgba(255,255,255,0.09));border-radius:8px;
                     cursor:pointer;font-size:14px;font-family:inherit">Go back</button>
          </div>`;
      } else {
        const route = nav.route;
        const mod = await this.schedule(scheduler, {
          type: 'network',
          priority: 'high',
          id: `route:load:${ctx.executionId}:${route.chunkId}`,
          url: route.path,
          signal: ctx.signal,
          task: async (signal) => {
            ensureNotAborted(signal);
            return await route.load();
          },
        });
        if (ctx.signal.aborted) return;
        ctx.container.innerHTML = '';
        unmount = mod.mount(ctx.container, nav.params);
      }
    } finally {
      if (ctx.signal.aborted) return;
      this.active = { ctx, plan, unmount };
    }

    const completedAt = Date.now();
    this.events.emit(NAVIGATION_COMPLETE, {
      executionId: ctx.executionId,
      completedAt,
      durationMs: completedAt - ctx.startTime,
    });
  }
}

