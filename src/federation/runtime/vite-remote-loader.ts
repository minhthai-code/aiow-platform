import type { RemoteLoader } from './remote-loader';

export class ViteRemoteLoader implements RemoteLoader {
  async loadModule<T = unknown>(productId: string, exposedName: string): Promise<T> {
    // Minimal loader: treat `exposedName` as a fully qualified module URL.
    // productId is kept for logging/metrics in future iterations.
    void productId;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (await import(/* @vite-ignore */ exposedName as any)) as T;
  }
}

