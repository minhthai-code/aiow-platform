import type { RouteDefinition, RouteParams } from '@core/types';

export const NAVIGATION_START = 'engine:navigation:start' as const;
export const NAVIGATION_CANCEL = 'engine:navigation:cancel' as const;
export const NAVIGATION_COMPLETE = 'engine:navigation:complete' as const;

export type EngineEventType =
  | typeof NAVIGATION_START
  | typeof NAVIGATION_CANCEL
  | typeof NAVIGATION_COMPLETE;

export type NavigationMode = 'push' | 'replace' | 'pop';

export interface NavigationIntent {
  readonly to: string;
  readonly mode: NavigationMode;
  readonly params?: RouteParams;
  readonly from?: string;
  readonly container: HTMLElement;
  /**
   * Transitional: router supplies concrete route match for v6 behavior parity.
   * Later steps will replace this with a planner-produced handle.
   */
  readonly route?: RouteDefinition;
  readonly cachedState?: unknown;
}

export interface EngineNavigationStartPayload {
  readonly executionId: string;
  readonly intent: NavigationIntent;
  readonly startedAt: number;
}

export interface EngineNavigationCancelPayload {
  readonly executionId: string;
  readonly replacedByExecutionId?: string;
  readonly reason: 'superseded' | 'explicit';
  readonly cancelledAt: number;
}

export interface EngineNavigationCompletePayload {
  readonly executionId: string;
  readonly completedAt: number;
  readonly durationMs: number;
}

export interface EngineEventMap {
  [NAVIGATION_START]: EngineNavigationStartPayload;
  [NAVIGATION_CANCEL]: EngineNavigationCancelPayload;
  [NAVIGATION_COMPLETE]: EngineNavigationCompletePayload;
}

export type EngineEventListener<T extends EngineEventType> = (payload: EngineEventMap[T]) => void;

export interface EngineEventEmitter {
  on<T extends EngineEventType>(event: T, listener: EngineEventListener<T>): () => void;
  emit<T extends EngineEventType>(event: T, payload: EngineEventMap[T]): void;
}

export function createEngineEventEmitter(): EngineEventEmitter {
  const listeners = new Map<EngineEventType, Set<(payload: unknown) => void>>();

  function on<T extends EngineEventType>(event: T, listener: EngineEventListener<T>): () => void {
    let set = listeners.get(event);
    if (!set) {
      set = new Set();
      listeners.set(event, set);
    }
    const wrapped = (payload: unknown) => listener(payload as EngineEventMap[T]);
    set.add(wrapped);
    return () => {
      const s = listeners.get(event);
      if (!s) return;
      s.delete(wrapped);
      if (s.size === 0) listeners.delete(event);
    };
  }

  function emit<T extends EngineEventType>(event: T, payload: EngineEventMap[T]): void {
    const set = listeners.get(event);
    if (!set || set.size === 0) return;
    for (const fn of set) {
      try { fn(payload); } catch { /* isolate listeners */ }
    }
  }

  return { on, emit };
}

