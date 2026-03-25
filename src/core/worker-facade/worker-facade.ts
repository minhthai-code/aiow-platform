/**
 * WorkerFacade — Platform worker offload API
 *
 * Wraps Web Workers in a clean promise-based interface.
 * Allows heavy CPU work to run off the main thread:
 *   - JSON parsing for large payloads
 *   - Image processing hints
 *   - Navigation prediction model evaluation
 *   - Search index building
 *
 * Usage:
 *   const result = await workerFacade.run('parseJson', { data: largeString });
 *
 * Worker pool:
 *   - Max 2 workers (navigator.hardwareConcurrency is often ≥ 4)
 *   - Tasks queue when all workers are busy
 *   - Workers are created lazily and terminated after 30s idle
 */

export type WorkerTask =
  | { type: 'parseJson';    payload: { data: string } }
  | { type: 'sortVideos';   payload: { ids: string[]; scores: number[] } }
  | { type: 'buildIndex';   payload: { items: { id: string; text: string }[] } }
  | { type: 'predictNav';   payload: { matrix: unknown; currentPath: string } };

export type WorkerResult<T extends WorkerTask> =
  T extends { type: 'parseJson' }  ? unknown :
  T extends { type: 'sortVideos' } ? string[] :
  T extends { type: 'buildIndex' } ? Map<string, string[]> :
  T extends { type: 'predictNav' } ? { path: string; confidence: number }[] :
  never;

const WORKER_SCRIPT = `
/* Inline worker — no separate file needed */
self.onmessage = function(e) {
  const { id, type, payload } = e.data;
  let result;
  try {
    switch (type) {
      case 'parseJson':
        result = JSON.parse(payload.data);
        break;
      case 'sortVideos': {
        const pairs = payload.ids.map((id, i) => [id, payload.scores[i]]);
        pairs.sort((a, b) => b[1] - a[1]);
        result = pairs.map(p => p[0]);
        break;
      }
      case 'buildIndex': {
        const index = {};
        for (const { id, text } of payload.items) {
          const words = text.toLowerCase().split(/\\W+/).filter(Boolean);
          for (const w of words) {
            if (!index[w]) index[w] = [];
            index[w].push(id);
          }
        }
        result = index;
        break;
      }
      default:
        result = null;
    }
    self.postMessage({ id, ok: true, result });
  } catch (err) {
    self.postMessage({ id, ok: false, error: err.message });
  }
};
`;

interface PendingTask {
  resolve: (v: unknown) => void;
  reject:  (e: Error)   => void;
}

class WorkerFacade {
  private readonly _maxWorkers = Math.min(2, navigator.hardwareConcurrency ?? 2);
  private readonly _workers:  Worker[]    = [];
  private readonly _idle:     boolean[]   = [];
  private readonly _pending   = new Map<number, PendingTask>();
  private readonly _queue:    { id: number; msg: unknown }[] = [];
  private _taskId = 0;
  private _idleTimers: (ReturnType<typeof setTimeout> | null)[] = [];

  private _createWorker(idx: number): Worker {
    const blob = new Blob([WORKER_SCRIPT], { type: 'application/javascript' });
    const url  = URL.createObjectURL(blob);
    const w    = new Worker(url);
    w.onmessage = (e: MessageEvent) => this._onMessage(idx, e);
    w.onerror   = () => this._onError(idx);
    this._idle[idx] = true;
    this._idleTimers[idx] = null;
    return w;
  }

  async run<T extends WorkerTask>(task: T): Promise<WorkerResult<T>> {
    const id  = ++this._taskId;
    const msg = { id, type: task.type, payload: task.payload };

    return new Promise<WorkerResult<T>>((resolve, reject) => {
      this._pending.set(id, {
        resolve: resolve as (v: unknown) => void,
        reject,
      });
      this._queue.push({ id, msg });
      this._dispatch();
    });
  }

  private _dispatch(): void {
    while (this._queue.length > 0) {
      const idx = this._findIdleWorker();
      if (idx === -1) break;

      const task = this._queue.shift()!;
      this._idle[idx] = false;

      // Clear idle timer
      if (this._idleTimers[idx]) {
        clearTimeout(this._idleTimers[idx]!);
        this._idleTimers[idx] = null;
      }

      this._workers[idx]!.postMessage(task.msg);
    }
  }

  private _findIdleWorker(): number {
    for (let i = 0; i < this._workers.length; i++) {
      if (this._idle[i]) return i;
    }
    if (this._workers.length < this._maxWorkers) {
      const idx = this._workers.length;
      this._workers.push(this._createWorker(idx));
      return idx;
    }
    return -1;
  }

  private _onMessage(idx: number, e: MessageEvent): void {
    const { id, ok, result, error } = e.data;
    const pending = this._pending.get(id);
    if (!pending) return;
    this._pending.delete(id);

    if (ok) pending.resolve(result);
    else    pending.reject(new Error(error));

    this._idle[idx] = true;

    // Terminate worker after 30s idle to free memory
    this._idleTimers[idx] = setTimeout(() => {
      if (this._idle[idx] && this._workers[idx]) {
        this._workers[idx]!.terminate();
        this._workers.splice(idx, 1);
        this._idle.splice(idx, 1);
        this._idleTimers.splice(idx, 1);
      }
    }, 30_000);

    this._dispatch();
  }

  private _onError(idx: number): void {
    // Fail all pending tasks for this worker
    for (const [id, p] of this._pending) {
      p.reject(new Error('Worker crashed'));
      this._pending.delete(id);
    }
    this._idle[idx] = true;
    this._dispatch();
  }

  /** Terminate all workers (call on app teardown). */
  destroy(): void {
    for (const w of this._workers) w.terminate();
    this._workers.length = 0;
  }
}

export const workerFacade = new WorkerFacade();
