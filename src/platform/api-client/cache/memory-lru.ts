interface CacheEntry<V> { value: V; expiresAt: number; }

export class MemoryLRUCache<K, V> {
  private readonly store = new Map<K, CacheEntry<V>>();
  private readonly capacity: number;

  constructor(capacity: number) {
    this.capacity = capacity;
    setInterval(() => this._sweep(), 120_000);
  }

  get(key: K): V | undefined {
    const e = this.store.get(key);
    if (!e) return undefined;
    if (Date.now() > e.expiresAt) { this.store.delete(key); return undefined; }
    this.store.delete(key);
    this.store.set(key, e);
    return e.value;
  }

  set(key: K, value: V, ttlMs: number): void {
    if (this.store.size >= this.capacity && !this.store.has(key)) {
      const oldest = this.store.keys().next().value;
      if (oldest !== undefined) this.store.delete(oldest);
    }
    this.store.set(key, { value, expiresAt: Date.now() + ttlMs });
  }

  delete(key: K): void { this.store.delete(key); }

  private _sweep(): void {
    const now = Date.now();
    for (const [k, e] of this.store) if (now > e.expiresAt) this.store.delete(k);
  }
}
