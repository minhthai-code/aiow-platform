import type { BuildGraph } from '../model/build-graph';

export interface BudgetRule {
  chunkName: string;
  maxBytes: number;
}

export interface BudgetViolation {
  chunkName: string;
  sizeBytes: number;
  maxBytes: number;
}

export function checkBudgets(_graph: BuildGraph, _rules: BudgetRule[]): BudgetViolation[] {
  // Tooling stub: real implementation will compare built chunk sizes to budgets.
  return [];
}

