/**
 * PrefetchEngine — Predictive resource pre-loading
 *
 * Four-tier strategy (same as YouTube's internal prefetch pipeline):
 *
 *   Tier 1 SOFT   → <link rel="prefetch"> for likely-next routes (idle)
 *   Tier 2 HOVER  → dynamic import() on anchor hover/touchstart
 *   Tier 3 DATA   → call feature.prefetch() to warm API caches
 *   Tier 4 VIEWPORT → IntersectionObserver: load bundle when link enters viewport
 *
 * Deduplication: each chunkId is prefetched at most once per session.
 * Respects experiment flag `enable_prefetch` and `prefetch_hover_delay_ms`.
 */

import { getBoolFlag, getNumberFlag } from '@platform/experiments/experiment-engine';
import { schedule } from '@core/scheduler/scheduler';
import type { RouteDefinition, FeatureModule } from '@core/types';

type Loader = () => Promise<FeatureModule>;

const _done    = new Set<string>();
const _pending = new Map<string, Promise<FeatureModule>>();

// ── Tier 2: Hover prefetch ────────────────────────────────

let _hoverTimer: ReturnType<typeof setTimeout> | null = null;

export function prefetchOnHover(chunkId: string, loader: Loader): void {
  if (!getBoolFlag('enable_prefetch')) return;
  if (_done.has(chunkId) || _pending.has(chunkId)) return;

  const delay = getNumberFlag('prefetch_hover_delay_ms') as number;

  if (_hoverTimer) clearTimeout(_hoverTimer);
  _hoverTimer = setTimeout(() => {
    _load(chunkId, loader);
  }, delay);
}

export function cancelHoverPrefetch(): void {
  if (_hoverTimer) { clearTimeout(_hoverTimer); _hoverTimer = null; }
}

// ── Tier 1: Soft prefetch via <link> ─────────────────────

export function softPrefetch(bundleUrl: string): void {
  if (!getBoolFlag('enable_prefetch')) return;
  if (document.querySelector(`link[href="${bundleUrl}"]`)) return;
  schedule('prefetch:soft:' + bundleUrl, () => {
    const link = document.createElement('link');
    link.rel  = 'prefetch';
    link.as   = 'script';
    link.href = bundleUrl;
    document.head.appendChild(link);
  }, 'background');
}

// ── Tier 4: Viewport-triggered prefetch ──────────────────

export function observeForPrefetch(
  elements: NodeListOf<Element> | Element[],
  getRoute: (el: Element) => { chunkId: string; loader: Loader } | null,
): () => void {
  if (!getBoolFlag('enable_prefetch')) return () => {};

  const io = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      const route = getRoute(entry.target);
      if (route) {
        _load(route.chunkId, route.loader);
        io.unobserve(entry.target);
      }
    }
  }, { rootMargin: '400px' });

  for (const el of elements) io.observe(el);
  return () => io.disconnect();
}

// ── Tier 3: Data prefetch ─────────────────────────────────

export async function prefetchData(
  route: RouteDefinition,
  params: Record<string, string>,
): Promise<void> {
  if (!getBoolFlag('enable_prefetch')) return;
  try {
    const mod = await _load(route.chunkId, route.load);
    mod.prefetch?.(params);
  } catch {/* silent */}
}

// ── Core loader (dedup) ───────────────────────────────────

function _load(chunkId: string, loader: Loader): Promise<FeatureModule> {
  if (_done.has(chunkId)) return Promise.resolve({ displayName: chunkId, mount: () => () => {} });
  if (_pending.has(chunkId)) return _pending.get(chunkId)!;

  const p = loader()
    .then(mod => { _done.add(chunkId); _pending.delete(chunkId); return mod; })
    .catch(err => { _pending.delete(chunkId); throw err; });

  _pending.set(chunkId, p);
  return p;
}

export function isPrefetched(chunkId: string): boolean {
  return _done.has(chunkId);
}

export function getStats(): { prefetched: number; pending: number } {
  return { prefetched: _done.size, pending: _pending.size };
}
