import type { EntityEnvelope, EntityStore } from '../store/entity-store';
import type { InvalidationManager, InvalidationTag } from '../invalidation/invalidation-manager';
import { schedule } from '@core/scheduler/scheduler';
import { V7Tracer } from '@observability/tracing/trace-api';

export type QueryKey = readonly unknown[];

export interface QueryResult<T> {
  data: T;
  fromCache: boolean;
}

export interface QueryContext {
  signal?: AbortSignal;
}

export interface QueryDefinition<T> {
  key: QueryKey;
  tags?: InvalidationTag[];
  fetch: (ctx: QueryContext) => Promise<{ data: T; entities?: EntityEnvelope[] }>;
}

function keyToString(key: QueryKey): string {
  return JSON.stringify(key);
}

export class QueryClient {
  private readonly cache = new Map<string, unknown>();
  private readonly keyTags = new Map<string, InvalidationTag[]>();
  private readonly staleKeys = new Set<string>();
  private readonly tracer = new V7Tracer();

  constructor(
    private readonly store: EntityStore,
    private readonly invalidation: InvalidationManager,
  ) {
    this.invalidation.onInvalidate(tags => {
      for (const [key, kt] of this.keyTags) {
        if (matchesAnyTag(kt, tags)) this.staleKeys.add(key);
      }
    });
  }

  get entityStore(): EntityStore {
    return this.store;
  }

  async fetchQuery<T>(q: QueryDefinition<T>, ctx: QueryContext = {}): Promise<QueryResult<T>> {
    const key = keyToString(q.key);
    const cached = this.cache.get(key) as T | undefined;
    if (cached !== undefined && !this.staleKeys.has(key)) {
      return { data: cached, fromCache: true };
    }

    const span = this.tracer.startSpan('dataGraph.fetchQuery', { key });
    const res = await q.fetch(ctx);
    this.tracer.endSpan(span);

    // Normalize entity envelopes into store if provided
    if (res.entities?.length) this.store.bulkPut(res.entities);

    this.cache.set(key, res.data);
    if (q.tags?.length) this.keyTags.set(key, q.tags);
    this.staleKeys.delete(key);

    // Allow observers to react async without blocking current task
    schedule(`data-graph:query:${key}`, () => {}, 'background');

    return { data: res.data, fromCache: false };
  }

  invalidate(tags: InvalidationTag[]): void {
    this.invalidation.invalidate(tags);
  }

  clear(): void {
    this.cache.clear();
    this.keyTags.clear();
    this.staleKeys.clear();
  }
}

function matchesAnyTag(keyTags: InvalidationTag[], incoming: InvalidationTag[]): boolean {
  for (const t of incoming) {
    for (const kt of keyTags) {
      if (kt.type !== t.type) continue;
      if (kt.id && t.id && kt.id !== t.id) continue;
      return true;
    }
  }
  return false;
}

