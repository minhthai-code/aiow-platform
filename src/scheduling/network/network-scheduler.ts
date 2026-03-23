import { on } from '@core/runtime-api/event-bus';

export type NetworkPriority = 'critical' | 'high' | 'normal' | 'low' | 'idle';

export interface NetworkRequestDescriptor {
  id: string;
  priority: NetworkPriority;
  url?: string;
  signal?: AbortSignal;
}

interface PendingJob<T> {
  desc: NetworkRequestDescriptor;
  exec: (signal: AbortSignal) => Promise<T>;
  resolve: (v: T) => void;
  reject: (e: unknown) => void;
  abort: AbortController;
}

export class NetworkScheduler {
  private readonly queues: Record<NetworkPriority, PendingJob<unknown>[]> = {
    critical: [],
    high: [],
    normal: [],
    low: [],
    idle: [],
  };

  private inFlight = 0;

  constructor(private readonly concurrency = 8) {
    // On navigation, cancel low/idle requests to reduce wasted work.
    on('route:will-change', () => {
      this.cancelPriority('idle');
      this.cancelPriority('low');
    });
  }

  schedule<T>(desc: NetworkRequestDescriptor, exec: (signal: AbortSignal) => Promise<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const abort = new AbortController();
      const job: PendingJob<T> = { desc, exec, resolve, reject, abort };

      // Propagate external abort
      if (desc.signal) {
        if (desc.signal.aborted) {
          reject(new DOMException('Aborted', 'AbortError'));
          return;
        }
        desc.signal.addEventListener('abort', () => abort.abort(), { once: true });
      }

      (this.queues[desc.priority] as PendingJob<unknown>[]).push(job as unknown as PendingJob<unknown>);
      this.drain();
    });
  }

  private nextJob(): PendingJob<unknown> | undefined {
    return (
      this.queues.critical.shift() ??
      this.queues.high.shift() ??
      this.queues.normal.shift() ??
      this.queues.low.shift() ??
      this.queues.idle.shift()
    );
  }

  private drain(): void {
    while (this.inFlight < this.concurrency) {
      const job = this.nextJob();
      if (!job) return;
      this.inFlight++;

      const signal = job.abort.signal;
      if (signal.aborted) {
        this.inFlight--;
        job.reject(new DOMException('Aborted', 'AbortError'));
        continue;
      }

      job.exec(signal)
        .then(v => job.resolve(v))
        .catch(e => job.reject(e))
        .finally(() => {
          this.inFlight--;
          this.drain();
        });
    }
  }

  private cancelPriority(priority: NetworkPriority): void {
    const q = this.queues[priority];
    while (q.length) {
      const job = q.shift()!;
      job.abort.abort();
      job.reject(new DOMException('Aborted', 'AbortError'));
    }
  }
}

