export class SuspenseBoundary {
  // Minimal placeholder API for future suspense support
  async run<T>(work: () => Promise<T>): Promise<T> {
    return work();
  }
}

