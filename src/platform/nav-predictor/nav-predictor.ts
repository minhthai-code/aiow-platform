/**
 * NavigationPredictor — System B from architecture assessment
 *
 * Lightweight heuristic navigation predictor.
 * Records user transitions and predicts likely next routes.
 *
 * Algorithm:
 *   1. Track transition pairs: (from) → (to) with count
 *   2. For current route, rank candidates by P(to | from) = count(from→to) / count(from)
 *   3. Return top-k predictions above confidence threshold
 *
 * This is the "client-side heuristic model" described in System B.
 * The ML layer (server-trained weights pushed to client) would slot in
 * as a replacement for step 2 above — the interface stays the same.
 *
 * Privacy: only path patterns stored, no user IDs or query values.
 */

interface Transition { from: string; to: string; }
interface Prediction  { path: string; confidence: number; }

const MAX_HISTORY        = 100;   // keep last N transitions
const MIN_CONFIDENCE     = 0.15;  // don't predict below 15%
const MAX_PREDICTIONS    = 3;     // top-k
const STORAGE_KEY        = 'yt_nav_transitions';

class NavigationPredictor {
  // from → { to → count }
  private readonly _matrix = new Map<string, Map<string, number>>();
  private readonly _history: Transition[] = [];

  constructor() {
    this._load();
  }

  /** Record a completed navigation. Call after route is mounted. */
  record(from: string, to: string): void {
    if (!from || !to || from === to) return;

    // Normalise: strip query strings for matrix keys but keep pattern
    const normFrom = this._norm(from);
    const normTo   = this._norm(to);

    if (!this._matrix.has(normFrom)) this._matrix.set(normFrom, new Map());
    const row = this._matrix.get(normFrom)!;
    row.set(normTo, (row.get(normTo) ?? 0) + 1);

    this._history.push({ from: normFrom, to: normTo });
    if (this._history.length > MAX_HISTORY) this._history.shift();

    this._persist();
  }

  /**
   * Predict the top-k most likely next routes from currentPath.
   * Returns sorted by descending confidence.
   */
  predict(currentPath: string): Prediction[] {
    const normCurrent = this._norm(currentPath);
    const row = this._matrix.get(normCurrent);
    if (!row || row.size === 0) return this._fallback();

    const total = [...row.values()].reduce((s, c) => s + c, 0);
    return [...row.entries()]
      .map(([path, count]) => ({ path, confidence: count / total }))
      .filter(p => p.confidence >= MIN_CONFIDENCE)
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, MAX_PREDICTIONS);
  }

  /** Global popularity fallback for cold start */
  private _fallback(): Prediction[] {
    const totals = new Map<string, number>();
    for (const [, row] of this._matrix) {
      for (const [path, count] of row) {
        totals.set(path, (totals.get(path) ?? 0) + count);
      }
    }
    const grand = [...totals.values()].reduce((s, c) => s + c, 0);
    if (grand === 0) return [];
    return [...totals.entries()]
      .map(([path, count]) => ({ path, confidence: count / grand }))
      .filter(p => p.confidence >= MIN_CONFIDENCE)
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, MAX_PREDICTIONS);
  }

  /** Normalise path: remove query, replace video IDs with :id placeholder */
  private _norm(raw: string): string {
    const qIdx = raw.indexOf('?');
    const path  = qIdx >= 0 ? raw.slice(0, qIdx) : raw;
    // /watch → /watch/:id  (so different videos share same bucket)
    return path.replace(/\/[a-zA-Z0-9_-]{8,}$/, '/:id');
  }

  private _persist(): void {
    try {
      const data: [string, [string, number][]][] = [];
      for (const [from, row] of this._matrix) {
        data.push([from, [...row.entries()]]);
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {/* storage full — skip */}
  }

  private _load(): void {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const data = JSON.parse(raw) as [string, [string, number][]][];
      for (const [from, entries] of data) {
        this._matrix.set(from, new Map(entries));
      }
    } catch {/* corrupt — ignore */}
  }

  getStats(): { routes: number; transitions: number } {
    let transitions = 0;
    for (const row of this._matrix.values()) {
      for (const count of row.values()) transitions += count;
    }
    return { routes: this._matrix.size, transitions };
  }
}

export const navPredictor = new NavigationPredictor();
