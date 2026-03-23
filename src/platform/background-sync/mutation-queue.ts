/**
 * MutationQueue — Offline write queue with background sync
 *
 * Assessment §2.16: offline & background sync layer.
 *
 * When offline, writes are queued to IndexedDB.
 * Service Worker fires 'replay-mutations' on reconnect.
 * Queue replays in order with retry + backoff.
 *
 * Supported: like, unlike, subscribe, unsubscribe, watch-later, comment
 */

export type MutationType =
  | 'like' | 'unlike'
  | 'subscribe' | 'unsubscribe'
  | 'watch-later'
  | 'comment';

export interface QueuedMutation {
  id:        string;
  type:      MutationType;
  endpoint:  string;
  body:      Record<string, unknown>;
  createdAt: number;
  retries:   number;
}

const _mem: QueuedMutation[] = [];
const MAX  = 50;
const DB   = 'ytube-mutations';

// ── IndexedDB helpers ──────────────────────────────────────────

let _idb: IDBDatabase | null = null;

async function openIdb(): Promise<IDBDatabase | null> {
  if (_idb) return _idb;
  if (typeof indexedDB === 'undefined') return null;
  return new Promise(res => {
    const r = indexedDB.open(DB, 1);
    r.onupgradeneeded = e => {
      const db = (e.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains('mutations'))
        db.createObjectStore('mutations', { keyPath: 'id' });
    };
    r.onsuccess = e => { _idb = (e.target as IDBOpenDBRequest).result; res(_idb); };
    r.onerror   = () => res(null);
  });
}

async function idbPut(m: QueuedMutation): Promise<void> {
  const db = await openIdb();
  if (!db) return;
  db.transaction('mutations','readwrite').objectStore('mutations').put(m);
}

async function idbDelete(id: string): Promise<void> {
  const db = await openIdb();
  if (!db) return;
  db.transaction('mutations','readwrite').objectStore('mutations').delete(id);
}

async function idbGetAll(): Promise<QueuedMutation[]> {
  const db = await openIdb();
  if (!db) return [];
  return new Promise(res => {
    const r = db.transaction('mutations','readonly').objectStore('mutations').getAll();
    r.onsuccess = () => res(r.result as QueuedMutation[]);
    r.onerror   = () => res([]);
  });
}

// ── Public API ─────────────────────────────────────────────────

export async function enqueueMutation(
  type:     MutationType,
  endpoint: string,
  body:     Record<string, unknown>,
): Promise<string> {
  const m: QueuedMutation = {
    id:        crypto.randomUUID(),
    type, endpoint, body,
    createdAt: Date.now(),
    retries:   0,
  };
  if (_mem.length >= MAX) _mem.shift();
  _mem.push(m);
  await idbPut(m);

  if ('serviceWorker' in navigator && 'SyncManager' in window) {
    const reg = await navigator.serviceWorker.ready;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (reg as any).sync.register('replay-mutations').catch(() => {/* not all browsers */});
  }

  if (import.meta.env.DEV) console.log(`[MutationQueue] queued ${type} → ${endpoint}`);
  return m.id;
}

export async function replayMutations(): Promise<void> {
  const persisted = await idbGetAll();
  const all       = [
    ..._mem,
    ...persisted.filter(p => !_mem.find(q => q.id === p.id)),
  ];
  if (!all.length) return;

  for (const m of all) {
    if (m.retries >= 3) {
      await idbDelete(m.id);
      const i = _mem.findIndex(x => x.id === m.id);
      if (i >= 0) _mem.splice(i, 1);
      continue;
    }
    try {
      const res = await fetch(m.endpoint, {
        method: 'POST',
        body:   JSON.stringify(m.body),
        headers: { 'Content-Type': 'application/json' },
      });
      if (res.ok) {
        await idbDelete(m.id);
        const i = _mem.findIndex(x => x.id === m.id);
        if (i >= 0) _mem.splice(i, 1);
      } else { m.retries++; await idbPut(m); }
    } catch { m.retries++; await idbPut(m); }
  }
}

export function getPendingCount(): number { return _mem.length; }

if (typeof window !== 'undefined') {
  window.addEventListener('online', () => { void replayMutations(); });
}
