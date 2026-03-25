export type AsyncComponentLoader = () => Promise<unknown>;

export function defineAsyncComponent(tag: string, loader: AsyncComponentLoader): void {
  if (customElements.get(tag)) return;
  void loader().then(() => {
    // Component is expected to self-register via customElements.define
  });
}

