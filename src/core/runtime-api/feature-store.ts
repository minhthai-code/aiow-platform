import { schedule } from '@core/scheduler/scheduler';
import type { Action, Reducer, StoreListener } from '@core/types';

let _traceCounter = 0;
function nextTraceId() { return `trace-${Date.now()}-${++_traceCounter}`; }

export class FeatureStore<S, A extends Action = Action> {
  private _state: S;
  private readonly _reducer: Reducer<S, A>;
  private readonly _featureId: string;
  private readonly _listeners = new Set<StoreListener<S>>();
  private readonly _rollbackMap = new Map<string, S>();
  private _dispatchQueue: Promise<void> = Promise.resolve();

  constructor(featureId: string, initialState: S, reducer: Reducer<S, A>) {
    this._featureId = featureId;
    this._state     = initialState;
    this._reducer   = reducer;
  }

  getState(): Readonly<S> { return this._state; }

  dispatch(actionInput: Omit<A, 'traceId' | 'timestamp' | 'featureId'>): string {
    const traceId = nextTraceId();
    const action  = { ...actionInput, traceId, timestamp: Date.now(), featureId: this._featureId } as A;
    this._dispatchQueue = this._dispatchQueue.then(() => this._apply(action));
    return traceId;
  }

  private _apply(action: A): void {
    const prev = this._state;
    const next = this._reducer(prev, action);
    if (next === prev) return;
    this._rollbackMap.set(action.traceId, prev);
    this._state = next;
    this._notify(next, prev);
  }

  rollback(traceId: string): void {
    const prev = this._rollbackMap.get(traceId);
    if (!prev) return;
    const cur = this._state;
    this._state = prev;
    this._rollbackMap.delete(traceId);
    this._notify(prev, cur);
  }

  subscribe(listener: StoreListener<S>): () => void {
    this._listeners.add(listener);
    return () => this._listeners.delete(listener);
  }

  private _notify(next: S, prev: S): void {
    schedule(`store:${this._featureId}:notify`, () => {
      for (const l of this._listeners) {
        try { l(next, prev); } catch (e) { console.error(`[Store:${this._featureId}]`, e); }
      }
    }, 'user-visible');
  }

  snapshot(): S { return structuredClone(this._state); }
  restore(s: S): void { const p = this._state; this._state = s; this._notify(s, p); }
}
