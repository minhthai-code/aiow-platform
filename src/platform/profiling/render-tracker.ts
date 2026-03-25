const renderCounts = new Map<string, number>();

export function markRender(featureId: string): void {
  const next = (renderCounts.get(featureId) ?? 0) + 1;
  renderCounts.set(featureId, next);
}

export function getRenderCount(featureId: string): number {
  return renderCounts.get(featureId) ?? 0;
}

