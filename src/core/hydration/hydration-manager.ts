/**
 * HydrationManager — System A from architecture assessment
 *
 * Implements client-side progressive hydration protocol.
 * Works with server-streamed HTML that contains hydration markers.
 *
 * SSR HTML structure (what the edge SSR service produces):
 *
 *   <div data-hydrate="yt-header"   data-priority="critical" data-hash="abc123">
 *     ... static HTML shell ...
 *   </div>
 *   <div data-hydrate="yt-watch-page" data-priority="high" data-hash="def456">
 *     ... player placeholder ...
 *   </div>
 *   <div data-hydrate="yt-recommendations" data-priority="lazy" data-hash="ghi789">
 *     ... skeleton ...
 *   </div>
 *
 * Hydration phases:
 *   PHASE 1 (critical):  header, nav — hydrate immediately, block interaction
 *   PHASE 2 (high):      primary content (player, feed) — rAF-scheduled
 *   PHASE 3 (low):       comments, recommendations — idle-scheduled
 *
 * Without SSR (current SPA mode):
 *   HydrationManager acts as a progressive scheduler for component mounting
 *   so the shell appears instantly and heavy sections load progressively.
 */

import { schedule } from '@core/scheduler/scheduler';

export type HydrationPriority = 'critical' | 'high' | 'low';

export interface HydrationTask {
  componentName: string;
  priority:      HydrationPriority;
  mountFn:       () => void | Promise<void>;
  /** Called when hydration is complete — resolves the promise chain */
  onComplete?:   () => void;
}

const PHASE_PRIORITY_MAP: Record<HydrationPriority, 'immediate' | 'user-visible' | 'background'> = {
  critical: 'immediate',
  high:     'user-visible',
  low:      'background',
};

class HydrationManager {
  private readonly _queue: HydrationTask[] = [];
  private _running = false;
  private _completed = new Set<string>();

  /** Queue a component for hydration. */
  schedule(task: HydrationTask): void {
    this._queue.push(task);
    if (!this._running) this._drain();
  }

  /** Queue multiple tasks at once (e.g. from SSR marker scan). */
  scheduleAll(tasks: HydrationTask[]): void {
    for (const t of tasks) this._queue.push(t);
    if (!this._running) this._drain();
  }

  /** Returns a promise that resolves when all queued tasks are done. */
  whenAllDone(): Promise<void> {
    return new Promise(resolve => {
      const check = () => {
        if (this._queue.length === 0 && !this._running) { resolve(); return; }
        requestAnimationFrame(check);
      };
      check();
    });
  }

  isHydrated(componentName: string): boolean {
    return this._completed.has(componentName);
  }

  /**
   * Scan the DOM for server-rendered hydration markers.
   * Used when SSR is active and we need to hydrate server HTML.
   *
   * @param mountRegistry - maps componentName → mount function
   */
  hydrateFromDOM(mountRegistry: Map<string, () => void>): void {
    const markers = document.querySelectorAll<HTMLElement>('[data-hydrate]');
    const tasks: HydrationTask[] = [];

    for (const el of markers) {
      const componentName = el.dataset['hydrate'] ?? '';
      const priority      = (el.dataset['priority'] ?? 'low') as HydrationPriority;
      const mountFn       = mountRegistry.get(componentName);
      if (!mountFn) continue;

      tasks.push({
        componentName,
        priority,
        mountFn: () => {
          el.removeAttribute('data-hydrate');
          mountFn();
        },
      });
    }

    // Sort: critical first, then high, then low
    const order = { critical: 0, high: 1, low: 2 };
    tasks.sort((a, b) => order[a.priority] - order[b.priority]);
    this.scheduleAll(tasks);
  }

  private _drain(): void {
    if (this._queue.length === 0) { this._running = false; return; }
    this._running = true;

    // Sort queue by priority
    this._queue.sort((a, b) => {
      const order = { critical: 0, high: 1, low: 2 };
      return order[a.priority] - order[b.priority];
    });

    const task = this._queue.shift()!;
    const schedulerPriority = PHASE_PRIORITY_MAP[task.priority];

    schedule(`hydrate:${task.componentName}`, async () => {
      const t0 = performance.now();
      try {
        await task.mountFn();
        this._completed.add(task.componentName);
        task.onComplete?.();
        if (import.meta.env.DEV) {
          const ms = Math.round(performance.now() - t0);
          console.log(`[Hydration] ${task.componentName} (${task.priority}): ${ms}ms`);
        }
      } catch (err) {
        console.error(`[Hydration] Failed: ${task.componentName}`, err);
      }
      this._drain();
    }, schedulerPriority);
  }
}

export const hydrationManager = new HydrationManager();
