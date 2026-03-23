export interface EntityPatch {
  type: string;
  id: string;
  patch: Record<string, unknown>;
}

export type EntityUpdateHandler = (patch: EntityPatch) => void;

