import { schedule, type TaskPriority } from '@core/scheduler/scheduler';

export type RenderTaskPriority = TaskPriority;

export function scheduleRender(id: string, fn: () => void, priority: RenderTaskPriority = 'user-visible'): void {
  schedule(`render:${id}`, fn, priority);
}

