/**
 * PerformanceBudget — System H from architecture assessment
 *
 * Runtime component-level performance monitoring.
 * Works with PlatformElement to measure render durations and alert on budget violations.
 *
 * Budgets (ms):
 *   - First render (mount → first paint): CRITICAL budget
 *   - Update render: WARNING budget
 *   - Interaction response: must be < 200ms (INP target)
 *
 * In CI:
 *   - This module exports a `checkBudgets()` function that can be called
 *     from a headless test to assert no violations occurred.
 *
 * In production:
 *   - Violations sampled at 10% and sent to telemetry
 *   - Helps catch performance regressions post-deploy
 */

import { recordCustom } from '@platform/telemetry/telemetry';

export interface ComponentBudget {
  componentName: string;
  /** Max allowed first-render duration in ms */
  firstRenderMs:  number;
  /** Max allowed update duration in ms */
  updateMs:       number;
}

export interface PerfViolation {
  componentName: string;
  type:          'first-render' | 'update' | 'interaction';
  actualMs:      number;
  budgetMs:      number;
  severity:      'warning' | 'error';
  ts:            number;
}

// ── Default budgets ───────────────────────────────────────

const DEFAULT_BUDGETS: ComponentBudget[] = [
  { componentName: 'yt-home-page',    firstRenderMs: 100, updateMs: 16  },
  { componentName: 'yt-watch-page',   firstRenderMs: 150, updateMs: 16  },
  { componentName: 'yt-search-page',  firstRenderMs: 80,  updateMs: 16  },
  { componentName: 'yt-channel-page', firstRenderMs: 100, updateMs: 16  },
  { componentName: 'yt-video-card',   firstRenderMs: 8,   updateMs: 4   },
  { componentName: 'yt-sidebar',      firstRenderMs: 30,  updateMs: 8   },
  { componentName: 'yt-header',       firstRenderMs: 20,  updateMs: 8   },
  { componentName: 'yt-rail',         firstRenderMs: 15,  updateMs: 4   },
];

// ── Monitor ───────────────────────────────────────────────

class PerformanceBudgetMonitor {
  private readonly _budgets   = new Map<string, ComponentBudget>();
  private readonly _violations: PerfViolation[] = [];
  private readonly _renderTimes = new Map<string, number>();   // componentName → start

  constructor() {
    for (const b of DEFAULT_BUDGETS) this._budgets.set(b.componentName, b);
  }

  /** Register a custom budget (called from component). */
  register(budget: ComponentBudget): void {
    this._budgets.set(budget.componentName, budget);
  }

  /** Mark render start. Call in willUpdate / beforeRender. */
  markRenderStart(componentName: string): void {
    this._renderTimes.set(componentName, performance.now());
  }

  /** Mark render end. Returns violation if budget exceeded. */
  markRenderEnd(componentName: string, type: 'first-render' | 'update'): PerfViolation | null {
    const start = this._renderTimes.get(componentName);
    if (start == null) return null;
    this._renderTimes.delete(componentName);

    const actualMs = performance.now() - start;
    const budget   = this._budgets.get(componentName);
    if (!budget) return null;

    const budgetMs = type === 'first-render' ? budget.firstRenderMs : budget.updateMs;
    if (actualMs <= budgetMs) return null;

    const violation: PerfViolation = {
      componentName,
      type,
      actualMs:  Math.round(actualMs),
      budgetMs,
      severity:  actualMs > budgetMs * 2 ? 'error' : 'warning',
      ts:        Date.now(),
    };

    this._violations.push(violation);
    this._report(violation);
    return violation;
  }

  /** Check interaction response time (for INP measurement). */
  checkInteraction(componentName: string, durationMs: number): PerfViolation | null {
    if (durationMs <= 200) return null;   // INP target
    const violation: PerfViolation = {
      componentName,
      type:      'interaction',
      actualMs:  Math.round(durationMs),
      budgetMs:  200,
      severity:  durationMs > 500 ? 'error' : 'warning',
      ts:        Date.now(),
    };
    this._violations.push(violation);
    this._report(violation);
    return violation;
  }

  /** Used by CI headless tests to assert clean renders. */
  checkBudgets(): PerfViolation[] { return [...this._violations]; }

  /** Clear — call between route transitions in tests. */
  reset(): void { this._violations.length = 0; }

  getAllBudgets(): ReadonlyMap<string, ComponentBudget> { return this._budgets; }

  private _report(v: PerfViolation): void {
    if (import.meta.env.DEV) {
      const color = v.severity === 'error' ? '#ef5350' : '#ff9800';
      console.warn(
        `%c[PerfBudget] ${v.componentName} ${v.type}: ${v.actualMs}ms > ${v.budgetMs}ms`,
        `color:${color};font-weight:bold`,
      );
    }

    // Sample at 10% in prod
    if (!import.meta.env.DEV && Math.random() > 0.10) return;

    recordCustom('perf.budget.violation', v.actualMs, {
      component: v.componentName,
      type:      v.type,
      budget:    v.budgetMs,
      severity:  v.severity,
    });
  }
}

export const perfBudget = new PerformanceBudgetMonitor();
