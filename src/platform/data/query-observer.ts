export type QueryListener<T> = (value: T) => void;

export class QueryObserver<T> {
  private listeners = new Set<QueryListener<T>>();

  subscribe(listener: QueryListener<T>): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify(value: T): void {
    for (const listener of this.listeners) {
      listener(value);
    }
  }
}

