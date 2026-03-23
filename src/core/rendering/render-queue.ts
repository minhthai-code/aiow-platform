type RenderJob = () => void;

const queue: RenderJob[] = [];

export function enqueueRender(job: RenderJob): void {
  queue.push(job);
}

export function drainRenderQueue(): void {
  while (queue.length) {
    const job = queue.shift();
    if (job) {
      try {
        job();
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('[RenderQueue] job error', e);
      }
    }
  }
}

