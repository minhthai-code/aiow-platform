import type { RouteDefinition, RouteParams } from '@core/types';
import type { NavigationIntent } from '../engine-events';

export interface NavigationPlan {
  readonly route: RouteDefinition | null;
  readonly params: RouteParams;
}

export class NavigationPlanner {
  plan(intent: NavigationIntent): NavigationPlan {
    return {
      route: intent.route ?? null,
      params: intent.params ?? {},
    };
  }
}

