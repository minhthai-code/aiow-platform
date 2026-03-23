export interface InvalidationTag {
  type: string;
  id?: string;
}

export type InvalidationListener = (tags: InvalidationTag[]) => void;

export class InvalidationManager {
  private listeners = new Set<InvalidationListener>();

  invalidate(tags: InvalidationTag[]): void {
    for (const l of this.listeners) l(tags);
  }

  onInvalidate(listener: InvalidationListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
}

