export type EntityId = string;
export type EntityType = string;

export type EntityRecord = Record<string, unknown>;

export interface EntityRef {
  type: EntityType;
  id: EntityId;
}

export interface EntityEnvelope {
  type: EntityType;
  id: EntityId;
  data: EntityRecord;
}

export class EntityStore {
  private readonly entities = new Map<string, EntityRecord>();

  private key(ref: EntityRef): string {
    return `${ref.type}:${ref.id}`;
  }

  get(ref: EntityRef): EntityRecord | undefined {
    return this.entities.get(this.key(ref));
  }

  put(envelope: EntityEnvelope): void {
    this.entities.set(this.key({ type: envelope.type, id: envelope.id }), envelope.data);
  }

  bulkPut(envelopes: EntityEnvelope[]): void {
    for (const env of envelopes) this.put(env);
  }

  patch(ref: EntityRef, partial: EntityRecord): void {
    const prev = this.get(ref) ?? {};
    this.entities.set(this.key(ref), { ...prev, ...partial });
  }
}

