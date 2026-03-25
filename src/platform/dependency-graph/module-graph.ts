export interface ModuleNode {
  id: string;
  imports: string[];
}

export class ModuleGraph {
  private nodes = new Map<string, ModuleNode>();

  addModule(id: string, imports: string[] = []): void {
    this.nodes.set(id, { id, imports });
  }

  getModule(id: string): ModuleNode | undefined {
    return this.nodes.get(id);
  }
}

