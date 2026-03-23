export type RenderPhase = 'shell' | 'aboveTheFold' | 'interactive' | 'belowTheFold';

export interface RenderSlot {
  id: string;
  phase: RenderPhase;
  selector: string;
}

export interface RenderPlan {
  routeId: string;
  slots: RenderSlot[];
}

