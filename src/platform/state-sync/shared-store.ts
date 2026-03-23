export class SharedStore<T> {
  private value: T | undefined;

  get(): T | undefined {
    return this.value;
  }

  set(next: T): void {
    this.value = next;
  }
}

