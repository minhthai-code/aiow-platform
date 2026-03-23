import type { RenderPlan, RenderSlot } from './render-plan';

export interface RenderContext {
  outlet: HTMLElement;
  plan: RenderPlan;
}

export interface SlotRenderer {
  canRender(slot: RenderSlot): boolean;
  render(slot: RenderSlot, container: Element): Promise<void>;
}

export interface RenderManager {
  scheduleRender(ctx: RenderContext): Promise<void>;
}

/**
 * Minimal v7 foundation: phased render orchestration that can wrap the existing
 * feature module mount contract without changing behavior.
 */
export class DefaultRenderManager implements RenderManager {
  async scheduleRender(_ctx: RenderContext): Promise<void> {
    // Placeholder: render-plan execution will be added incrementally.
  }
}

