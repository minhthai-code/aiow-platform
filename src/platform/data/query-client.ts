export interface QueryClientConfig {
  baseUrl?: string;
}

export class QueryClient {
  // Minimal placeholder client
  constructor(_config: QueryClientConfig = {}) {}

  async fetchQuery<T>(_key: string, fn: () => Promise<T>): Promise<T> {
    return fn();
  }
}

