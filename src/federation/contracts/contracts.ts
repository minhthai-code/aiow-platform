export interface FederatedContract {
  id: string;
  version: string;
}

export function isCompatible(local: FederatedContract, remote: FederatedContract): boolean {
  // Minimal compatibility rule: exact match.
  return local.id === remote.id && local.version === remote.version;
}

