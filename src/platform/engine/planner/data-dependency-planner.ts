import type { RouteDefinition } from '@core/types';
import type { ExecutionQuery } from '../execution-plan';

export class DataDependencyPlanner {
  plan(_route: RouteDefinition | null): readonly ExecutionQuery[] {
    // Deferred: feature/query discovery will be added once DataGraph integration lands.
    return [];
  }
}

