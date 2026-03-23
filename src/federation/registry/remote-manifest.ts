export interface RemoteModuleEntry {
  exposedName: string;
  url: string;
}

export interface RemoteAppManifest {
  productId: string;
  version: string;
  modules: RemoteModuleEntry[];
}

