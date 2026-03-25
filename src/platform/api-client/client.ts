/**
 * ApiClient — Production HTTP Client
 *
 * Implements the full data-access layer described in the architecture doc:
 *
 *   Deduplication   → same in-flight key shares one Promise
 *   Micro-batching  → requests in 5ms window → single /batch RPC
 *   LRU cache       → per-tab memory cache with TTL
 *   Retry + jitter  → exponential backoff for idempotent requests
 *   Circuit breaker → stops hammering a failing backend (5 fail → 30s cooldown)
 *   Priority queue  → high-priority requests bypass batcher
 *   Tracing         → X-Trace-Id on every request
 *   Cancellation    → AbortSignal propagated to fetch()
 */

import { MemoryLRUCache } from './cache/memory-lru';
import { recordCustom } from '@platform/telemetry/telemetry';
import type { ApiResponse, RequestOptions } from '@core/types';
import { getRegisteredService } from '@core/runtime-api/platform-element';
import type { NetworkScheduler } from '@scheduling/network/network-scheduler';

// ── Circuit Breaker ───────────────────────────────────────
class CircuitBreaker {
  private failures  = 0;
  private lastFail  = 0;
  private readonly threshold  = 5;
  private readonly cooldownMs = 30_000;

  isOpen(): boolean {
    if (this.failures < this.threshold) return false;
    if (Date.now() - this.lastFail > this.cooldownMs) {
      this.failures = 0; // half-open: try again
      return false;
    }
    return true;
  }
  success(): void { this.failures = 0; }
  fail():    void { this.failures++; this.lastFail = Date.now(); }
}

// ── Request Batcher ───────────────────────────────────────
interface Queued {
  endpoint: string;
  method:   string;
  options:  RequestOptions;
  resolve:  (v: ApiResponse<unknown>) => void;
  reject:   (e: unknown) => void;
}

const BATCH_WINDOW = 5;   // ms
const MAX_BATCH    = 20;

class RequestBatcher {
  private queue: Queued[] = [];
  private timer: ReturnType<typeof setTimeout> | null = null;
  private readonly exec: (method: string, endpoint: string, body: unknown, opts: RequestOptions) => Promise<ApiResponse<unknown>>;

  constructor(exec: typeof this.exec) { this.exec = exec; }

  enqueue<T>(endpoint: string, method: string, options: RequestOptions): Promise<ApiResponse<T>> {
    return new Promise<ApiResponse<T>>((resolve, reject) => {
      this.queue.push({ endpoint, method, options, resolve: resolve as (v: ApiResponse<unknown>) => void, reject });
      if (!this.timer) this.timer = setTimeout(() => this._flush(), BATCH_WINDOW);
      if (this.queue.length >= MAX_BATCH) this._flush();
    });
  }

  private _flush(): void {
    if (this.timer) { clearTimeout(this.timer); this.timer = null; }
    const batch = this.queue.splice(0);
    if (!batch.length) return;

    if (batch.length === 1) {
      const r = batch[0]!;
      this.exec(r.method, r.endpoint, undefined, r.options).then(r.resolve).catch(r.reject);
      return;
    }

    this.exec('POST', '/batch', { requests: batch.map(r => ({ endpoint: r.endpoint, method: r.method })) }, {})
      .then(resp => {
        const results = resp.data as ApiResponse<unknown>[];
        batch.forEach((r, i) => results[i] ? r.resolve(results[i]!) : r.reject(new Error(`Batch missing index ${i}`)));
      })
      .catch(err => batch.forEach(r => r.reject(err)));
  }
}

// ── ApiClient ─────────────────────────────────────────────
export class ApiClient {
  private readonly baseUrl:      string;
  private readonly defaultTtlMs: number;
  private readonly maxRetries:   number;
  private readonly cache:        MemoryLRUCache<string, unknown>;
  private readonly circuit   = new CircuitBreaker();
  private readonly inFlight  = new Map<string, Promise<unknown>>();
  private readonly batcher:  RequestBatcher;
  private traceCounter = 0;

  constructor(cfg: { baseUrl: string; defaultTtlMs?: number; maxRetries?: number }) {
    this.baseUrl      = cfg.baseUrl;
    this.defaultTtlMs = cfg.defaultTtlMs ?? 60_000;
    this.maxRetries   = cfg.maxRetries   ?? 3;
    this.cache        = new MemoryLRUCache(512);
    this.batcher      = new RequestBatcher(this._doFetch.bind(this));
  }

  async get<T>(endpoint: string, opts: RequestOptions = {}): Promise<ApiResponse<T>> {
    const key = 'GET:' + endpoint;
    const hit = this.cache.get(key);
    if (hit) return hit as ApiResponse<T>;

    if (this.inFlight.has(key)) return this.inFlight.get(key) as Promise<ApiResponse<T>>;

    const p = (opts.priority === 'high'
      ? this._fetchWithRetry<T>('GET', endpoint, undefined, opts)
      : this.batcher.enqueue<T>(endpoint, 'GET', opts)
    ) as Promise<ApiResponse<T>>;

    this.inFlight.set(key, p);
    try {
      const res = await p;
      this.cache.set(key, res, opts.ttlMs ?? this.defaultTtlMs);
      return res;
    } finally { this.inFlight.delete(key); }
  }

  async post<T>(endpoint: string, body: unknown, opts: RequestOptions = {}): Promise<ApiResponse<T>> {
    return this._fetchWithRetry<T>('POST', endpoint, body, opts);
  }

  private async _fetchWithRetry<T>(method: string, endpoint: string, body: unknown, opts: RequestOptions): Promise<ApiResponse<T>> {
    const maxR   = opts.retries ?? (method === 'GET' ? this.maxRetries : 0);
    const traceId = `trace-${Date.now()}-${++this.traceCounter}`;
    const t0      = performance.now();

    for (let attempt = 0; attempt <= maxR; attempt++) {
      if (this.circuit.isOpen()) throw new Error(`[ApiClient] Circuit open — ${endpoint}`);
      if (opts.signal?.aborted)  throw new DOMException('Aborted', 'AbortError');

      try {
        const res = await this._doFetch<T>(method, endpoint, body, opts, traceId);
        this.circuit.success();
        recordCustom('api.latency', Math.round(performance.now() - t0), { endpoint, status: res.status });
        return res;
      } catch (err) {
        this.circuit.fail();
        if (attempt === maxR || opts.signal?.aborted) throw err;
        const base  = Math.min(1000 * 2 ** attempt, 10_000);
        const delay = base * (0.7 + Math.random() * 0.6);
        await new Promise(r => setTimeout(r, delay));
      }
    }
    throw new Error('[ApiClient] Max retries exhausted');
  }

  async _doFetch<T>(method: string, endpoint: string, body: unknown, opts: RequestOptions, traceId = 'trace-' + Date.now()): Promise<ApiResponse<T>> {
    const url  = this.baseUrl + endpoint;
    const t0   = performance.now();
    const init: RequestInit = {
      method,
      headers: { 'Content-Type':'application/json','Accept':'application/json','X-Trace-Id':traceId,'X-Client':'ytube-web' },
    };
    if (body   !== undefined) init.body   = JSON.stringify(body);
    if (opts.signal)          init.signal = opts.signal;

    const scheduler = this._getNetworkScheduler();
    const priority = opts.priority === 'high' ? 'high' : 'normal';
    const res = await scheduler.schedule(
      { id: `${method}:${endpoint}:${traceId}`, priority, url, signal: opts.signal },
      (signal) => fetch(url, { ...init, signal }),
    );
    if (!res.ok) throw new Error(`[ApiClient] ${method} ${endpoint} → ${res.status}`);
    const data = await res.json() as T;
    return { data, status: res.status, traceId, fromCache: false, latencyMs: Math.round(performance.now() - t0) };
  }

  invalidate(endpoint: string): void { this.cache.delete('GET:' + endpoint); }

  private _getNetworkScheduler(): NetworkScheduler {
    try {
      return getRegisteredService<NetworkScheduler>('NetworkScheduler');
    } catch {
      // In case DI is not ready yet (early boot), fall back to direct fetch scheduling.
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      return DefaultNetworkScheduler;
    }
  }
}

// Default scheduler preserves existing behavior (executes immediately).
const DefaultNetworkScheduler: NetworkScheduler = {
  schedule: async (_desc, exec) => await exec(new AbortController().signal),
} as NetworkScheduler;
