export interface SsrOrchestratorOptions {
  url: string;
}

export interface SsrOrchestrator {
  render(options: SsrOrchestratorOptions): ReadableStream<Uint8Array>;
}

