import type { PlatformEventType, PlatformEventPayload, EventListener } from '@core/types';

type ListenerEntry<T extends PlatformEventType> = {
  listener:   EventListener<T>;
  featureId?: string;
  once:       boolean;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const registry = new Map<PlatformEventType, Set<ListenerEntry<any>>>();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getOrCreate<T extends PlatformEventType>(event: T): Set<ListenerEntry<T>> {
  if (!registry.has(event)) registry.set(event, new Set());
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return registry.get(event) as Set<ListenerEntry<T>>;
}

export function on<T extends PlatformEventType>(
  event: T,
  listener: EventListener<T>,
  featureId?: string,
): () => void {
  const entry: ListenerEntry<T> = { listener, featureId, once: false };
  getOrCreate(event).add(entry);
  return () => getOrCreate(event).delete(entry);
}

export function emit<T extends PlatformEventType>(event: T, payload: PlatformEventPayload<T>): void {
  const entries = registry.get(event);
  if (!entries) return;
  for (const entry of [...entries]) {
    try { entry.listener(payload); } catch (e) { console.error(`[EventBus] "${event}" listener threw:`, e); }
    if (entry.once) entries.delete(entry);
  }
}

export function offAll(featureId: string): void {
  for (const entries of registry.values())
    for (const entry of entries)
      if (entry.featureId === featureId) entries.delete(entry);
}
