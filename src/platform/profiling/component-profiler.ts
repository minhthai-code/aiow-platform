export interface ProfileSample {
  name: string;
  durationMs: number;
}

export function profileComponentRender<T>(name: string, fn: () => T): T {
  const t0 = performance.now();
  const result = fn();
  const durationMs = performance.now() - t0;
  // Placeholder: in future, send to profiling pipeline
  // eslint-disable-next-line no-console
  console.debug('[ComponentProfiler]', { name, durationMs });
  return result;
}

