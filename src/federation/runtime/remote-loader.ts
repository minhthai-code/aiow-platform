export interface RemoteLoader {
  loadModule<T = unknown>(productId: string, exposedName: string): Promise<T>;
}

