export interface SpanMeta {
  [k: string]: string | number | boolean;
}

export interface TraceSpan {
  spanId: string;
  name: string;
  startMs: number;
  endMs?: number;
  meta?: SpanMeta;
  status: 'ok' | 'error';
  error?: string;
}

export class V7Tracer {
  startSpan(name: string, meta?: SpanMeta): TraceSpan {
    return {
      spanId: `span-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      name,
      startMs: performance.now(),
      meta,
      status: 'ok',
    };
  }

  endSpan(span: TraceSpan, err?: Error): void {
    span.endMs = performance.now();
    if (err) {
      span.status = 'error';
      span.error = err.message;
    }
  }
}

