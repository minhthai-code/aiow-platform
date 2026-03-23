import type { RouteDefinition } from '@core/types';
import type { RenderPhase } from '../execution-plan';

export class RenderPhasePlanner {
  plan(_route: RouteDefinition | null): readonly RenderPhase[] {
    return [{ id: 'shell' }, { id: 'above-the-fold' }];
  }
}

