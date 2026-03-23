import type { ResourceRequest } from './resource-priority-queue';

export class RequestCoordinator {
  // Placeholder for coordinating when resource requests should fire
  shouldExecute(_req: ResourceRequest): boolean {
    return true;
  }
}

