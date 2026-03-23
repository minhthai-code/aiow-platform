import type { RouteDefinition, RouteParams } from '@core/types';

export type RenderPhaseId = 'shell' | 'above-the-fold';

export interface RenderPhase {
  readonly id: RenderPhaseId;
}

export interface ExecutionQuery {
  readonly key: string;
  readonly priority: 'critical' | 'high' | 'normal' | 'low' | 'idle';
  readonly tags?: readonly string[];
}

export interface ExecutionPlan {
  readonly route: RouteDefinition | null;
  readonly params: RouteParams;
  readonly queries: readonly ExecutionQuery[];
  readonly renderPhases: readonly RenderPhase[];
}

