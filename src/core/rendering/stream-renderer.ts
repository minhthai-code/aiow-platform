export interface StreamChunk {
  html: string;
}

export interface StreamRenderResult {
  chunks: AsyncIterable<StreamChunk>;
}

export function createStreamRenderer(): StreamRenderResult {
  async function* empty() {
    // placeholder
  }
  return { chunks: empty() };
}

