/**
 * NavigationCache — System D
 * LRU memory cache (8 entries, 5-min TTL) for route snapshots.
 * Enables instant back/forward scroll restoration.
 */

const MAX_ENTRIES = 8;
const TTL_MS      = 5 * 60 * 1000;

export interface NavCacheEntry {
  routeKey: string;
  state:    unknown;
  scrollY:  number;
  savedAt:  number;
  version:  number;
}

class NavigationCache {
  private readonly _map   = new Map<string, NavCacheEntry>();
  private readonly _order: string[] = [];
  private _version = 0;

  save(routeKey: string, partial: Pick<NavCacheEntry, 'state' | 'scrollY'>): void {
    const entry: NavCacheEntry = {
      routeKey,
      state:   this._clone(partial.state),
      scrollY: partial.scrollY,
      savedAt: Date.now(),
      version: ++this._version,
    };
    if (this._map.has(routeKey)) {
      const idx = this._order.indexOf(routeKey);
      if (idx >= 0) this._order.splice(idx, 1);
    } else if (this._order.length >= MAX_ENTRIES) {
      const oldest = this._order.shift();
      if (oldest) this._map.delete(oldest);
    }
    this._map.set(routeKey, entry);
    this._order.push(routeKey);
  }

  get(routeKey: string): NavCacheEntry | null {
    const entry = this._map.get(routeKey);
    if (!entry) return null;
    if (Date.now() - entry.savedAt > TTL_MS) { this._evict(routeKey); return null; }
    const idx = this._order.indexOf(routeKey);
    if (idx >= 0) { this._order.splice(idx, 1); this._order.push(routeKey); }
    return entry;
  }

  invalidate(routeKey: string): void { this._evict(routeKey); }
  clear():                      void { this._map.clear(); this._order.length = 0; }

  getStats(): { size: number; keys: string[] } {
    return { size: this._map.size, keys: [...this._order] };
  }

  private _evict(k: string): void {
    this._map.delete(k);
    const idx = this._order.indexOf(k);
    if (idx >= 0) this._order.splice(idx, 1);
  }

  private _clone(v: unknown): unknown {
    try { return JSON.parse(JSON.stringify(v)); } catch { return null; }
  }
}

export const navCache = new NavigationCache();
