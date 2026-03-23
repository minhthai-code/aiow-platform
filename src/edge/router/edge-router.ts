export interface EdgeRequest {
  url: string;
  headers: Record<string, string>;
}

export interface EdgeResponse {
  status: number;
  headers: Record<string, string>;
  body: ReadableStream<Uint8Array>;
}

export interface EdgeRouter {
  handle(request: EdgeRequest): Promise<EdgeResponse>;
}

