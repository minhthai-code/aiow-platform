export type ResourcePriority = 'high' | 'normal' | 'low';

export interface ResourceRequest {
  id: string;
  priority: ResourcePriority;
}

export class ResourcePriorityQueue {
  private queue: ResourceRequest[] = [];

  enqueue(req: ResourceRequest): void {
    this.queue.push(req);
  }

  dequeue(): ResourceRequest | undefined {
    return this.queue.shift();
  }
}

