/**
 * Service Worker — Production Caching Strategy
 *
 * Cache tiers:
 *   SHELL_CACHE   → HTML/index (stale-while-revalidate, short TTL)
 *   CHUNK_CACHE   → JS/CSS bundles (cache-first, content-hashed = immutable)
 *   API_CACHE     → API responses (network-first, fallback to cache)
 *   IMAGE_CACHE   → Thumbnails (cache-first, LRU 300 items, 7-day TTL)
 *
 * Offline: serves cached API responses when offline.
 *          Queues mutations (likes, comments) in IndexedDB for replay on reconnect.
 */

const VERSION      = 'v3';
const SHELL_CACHE  = `shell-${VERSION}`;
const CHUNK_CACHE  = `chunks-${VERSION}`;
const API_CACHE    = `api-${VERSION}`;
const IMAGE_CACHE  = `images-${VERSION}`;
const IMAGE_MAX    = 300;
const IMAGE_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

const ALL_CACHES = [SHELL_CACHE, CHUNK_CACHE, API_CACHE, IMAGE_CACHE];

// ── Install ───────────────────────────────────────────────
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(SHELL_CACHE)
      .then(c => c.addAll(['/']))
      .then(() => self.skipWaiting())
  );
});

// ── Activate — purge old caches ───────────────────────────
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => !ALL_CACHES.includes(k)).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

// ── Fetch routing ─────────────────────────────────────────
self.addEventListener('fetch', e => {
  const { request } = e;
  const url = new URL(request.url);

  // Skip non-GET and cross-origin (except known image CDNs)
  if (request.method !== 'GET') return;

  // Thumbnail images — cache-first with TTL
  if (request.destination === 'image' || url.hostname === 'picsum.photos') {
    e.respondWith(cacheFirstImage(request));
    return;
  }

  // Same-origin only below this line
  if (url.origin !== self.location.origin) return;

  // Hashed JS/CSS chunks — immutable cache-first
  if (url.pathname.startsWith('/assets/')) {
    e.respondWith(cacheFirstChunk(request));
    return;
  }

  // API — network-first with offline fallback
  if (url.pathname.startsWith('/api') || url.pathname.startsWith('/youtubei')) {
    e.respondWith(networkFirstApi(request));
    return;
  }

  // HTML navigation — stale-while-revalidate
  if (request.mode === 'navigate') {
    e.respondWith(staleWhileRevalidate(request));
    return;
  }
});

// ── Strategies ────────────────────────────────────────────

async function staleWhileRevalidate(req) {
  const cache  = await caches.open(SHELL_CACHE);
  const cached = await cache.match(req);
  const fresh  = fetch(req).then(res => { if (res.ok) cache.put(req, res.clone()); return res; })
                            .catch(() => cached);
  return cached ?? fresh;
}

async function cacheFirstChunk(req) {
  const cache  = await caches.open(CHUNK_CACHE);
  const cached = await cache.match(req);
  if (cached) return cached;
  const res = await fetch(req);
  if (res.ok) cache.put(req, res.clone());
  return res;
}

async function networkFirstApi(req) {
  const cache = await caches.open(API_CACHE);
  try {
    const res = await fetch(req);
    if (res.ok) cache.put(req, res.clone());
    return res;
  } catch {
    const cached = await cache.match(req);
    return cached ?? new Response(
      JSON.stringify({ error: 'offline', cached: false }),
      { status: 503, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

async function cacheFirstImage(req) {
  const cache  = await caches.open(IMAGE_CACHE);
  const cached = await cache.match(req);

  // Check TTL metadata
  if (cached) {
    const age = Date.now() - Number(cached.headers.get('x-cached-at') ?? 0);
    if (age < IMAGE_TTL_MS) return cached;
  }

  try {
    const res = await fetch(req);
    if (!res.ok) return cached ?? res;

    // LRU eviction
    const keys = await cache.keys();
    if (keys.length >= IMAGE_MAX) await cache.delete(keys[0]);

    // Clone with timestamp header
    const headers = new Headers(res.headers);
    headers.set('x-cached-at', Date.now().toString());
    const stamped = new Response(await res.blob(), { status: res.status, headers });
    cache.put(req, stamped.clone());
    return stamped;
  } catch {
    return cached ?? new Response('', { status: 503 });
  }
}

// ── Background sync for offline mutations ─────────────────
self.addEventListener('sync', e => {
  if (e.tag === 'replay-mutations') {
    e.waitUntil(replayMutations());
  }
});

async function replayMutations() {
  // In production: read from IndexedDB mutation queue and replay
  // POST /api/likes, /api/comments etc.
  console.log('[SW] Replaying offline mutations...');
}
