/**
 * Tracing SDK — System F from architecture assessment
 *
 * OpenTelemetry-compatible lightweight tracing for the browser.
 * Correlates: component action → API call → backend response.
 *
 * Architecture:
 *   Span = unit of work { traceId, spanId, parentSpanId, name, start, end, attrs }
 *   Trace = tree of Spans sharing a traceId
 *   Context = current active span propagated via closure (not AsyncLocalStorage in browser)
 *
 * Propagation:
 *   Every outgoing fetch() gets X-Trace-Id and X-Span-Id headers
 *   so the backend can continue the trace and correlate
 *
 * Sampling: configurable (default 5% in production, 100% in dev)
 * Ingest: sampled traces batched to /api/traces via sendBeacon
 */

export interface Span {
  traceId:     string;
  spanId:      string;
  parentSpanId?: string;
  name:        string;
  startMs:     number;
  endMs?:      number;
  durationMs?: number;
  attrs:       Record<string, string | number | boolean>;
  status:      'ok' | 'error';
  error?:      string;
}

const IS_DEV        = import.meta.env.DEV;
const SAMPLE_RATE   = IS_DEV ? 1.0 : 0.05;        // 5% in prod
const INGEST_URL    = '/api/traces';
const MAX_BUFFER    = 200;
const FLUSH_INTERVAL_MS = 15_000;

// ── ID generation ─────────────────────────────────────────

function randomHex(bytes: number): string {
  return [...crypto.getRandomValues(new Uint8Array(bytes))]
    .map(b => b.toString(16).padStart(2, '0')).join('');
}

function newTraceId(): string { return randomHex(16); }  // 128-bit
function newSpanId():  string { return randomHex(8);  }  // 64-bit

// ── Span buffer ───────────────────────────────────────────

const _buffer: Span[] = [];
let   _flushTimer: ReturnType<typeof setInterval> | null = null;

function _flush(): void {
  if (_buffer.length === 0) return;
  const payload = JSON.stringify({ spans: _buffer.splice(0) });
  if (!navigator.sendBeacon(INGEST_URL, payload)) {
    fetch(INGEST_URL, { method: 'POST', body: payload, keepalive: true,
      headers: { 'Content-Type': 'application/json' } }).catch(() => {});
  }
}

// ── Tracer ────────────────────────────────────────────────

export class Tracer {
  private readonly _name: string;
  private _activeSpan: Span | null = null;

  constructor(name: string) { this._name = name; }

  /**
   * Start a new span. If a parent exists, child inherits traceId.
   * Returns the span object — call span.end() when done.
   */
  startSpan(
    name: string,
    attrs: Record<string, string | number | boolean> = {},
    parentSpan?: Span,
  ): Span {
    const parent = parentSpan ?? this._activeSpan;
    const span: Span = {
      traceId:      parent?.traceId ?? newTraceId(),
      spanId:       newSpanId(),
      parentSpanId: parent?.spanId,
      name:         `${this._name}:${name}`,
      startMs:      performance.now(),
      attrs:        { tracer: this._name, ...attrs },
      status:       'ok',
    };
    this._activeSpan = span;
    return span;
  }

  /** End a span and record it. */
  endSpan(span: Span, error?: Error): void {
    span.endMs    = performance.now();
    span.durationMs = span.endMs - span.startMs;
    if (error) { span.status = 'error'; span.error = error.message; }
    if (this._activeSpan?.spanId === span.spanId) this._activeSpan = null;
    this._record(span);
  }

  /** Convenience: wrap an async function in a span. */
  async trace<T>(
    name: string,
    fn: (span: Span) => Promise<T>,
    attrs: Record<string, string | number | boolean> = {},
  ): Promise<T> {
    const span = this.startSpan(name, attrs);
    try {
      const result = await fn(span);
      this.endSpan(span);
      return result;
    } catch (err) {
      this.endSpan(span, err as Error);
      throw err;
    }
  }

  /** Get headers to propagate trace context to backend. */
  propagationHeaders(span: Span): Record<string, string> {
    return {
      'X-Trace-Id':       span.traceId,
      'X-Span-Id':        span.spanId,
      'X-Parent-Span-Id': span.parentSpanId ?? '',
    };
  }

  get activeSpan(): Span | null { return this._activeSpan; }

  private _record(span: Span): void {
    // Sample
    if (Math.random() > SAMPLE_RATE) return;

    if (IS_DEV) {
      const color = span.status === 'error' ? '#ef5350' : '#4fc3f7';
      console.log(
        `%c[Trace] ${span.name}`,
        `color:${color};font-weight:bold`,
        `${span.durationMs?.toFixed(1)}ms`,
        span.attrs,
      );
    }

    if (_buffer.length < MAX_BUFFER) _buffer.push(span);
  }
}

// ── Global tracers ────────────────────────────────────────

export const routerTracer    = new Tracer('router');
export const storeTracer     = new Tracer('store');
export const networkTracer   = new Tracer('network');
export const componentTracer = new Tracer('component');

// ── Instrumented fetch ─────────────────────────────────────

/**
 * Wraps fetch() with tracing headers + a span.
 * Use this instead of raw fetch() in API client.
 */
export async function tracedFetch(
  url: string,
  init: RequestInit = {},
  parentSpan?: Span,
): Promise<Response> {
  const span = networkTracer.startSpan('fetch', { url: url.slice(0, 120) }, parentSpan);
  const headers = {
    ...(init.headers as Record<string, string> ?? {}),
    ...networkTracer.propagationHeaders(span),
  };
  try {
    const res = await fetch(url, { ...init, headers });
    span.attrs['http.status'] = res.status;
    networkTracer.endSpan(span);
    return res;
  } catch (err) {
    networkTracer.endSpan(span, err as Error);
    throw err;
  }
}

// ── Bootstrap ─────────────────────────────────────────────

export function initTracing(): void {
  _flushTimer = setInterval(_flush, FLUSH_INTERVAL_MS);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') _flush();
  });
}

export function destroyTracing(): void {
  if (_flushTimer) clearInterval(_flushTimer);
  _flush();
}
