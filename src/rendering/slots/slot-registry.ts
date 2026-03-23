import type { RenderSlot } from '../engine/render-plan';

export class SlotRegistry {
  private slots = new Map<string, RenderSlot>();

  register(slot: RenderSlot): void {
    this.slots.set(slot.id, slot);
  }

  get(id: string): RenderSlot | undefined {
    return this.slots.get(id);
  }
}

