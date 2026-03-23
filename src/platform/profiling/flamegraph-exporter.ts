export interface FlamegraphNode {
  name: string;
  children?: FlamegraphNode[];
}

export function exportFlamegraph(): FlamegraphNode {
  // Placeholder empty flamegraph
  return { name: 'root', children: [] };
}

