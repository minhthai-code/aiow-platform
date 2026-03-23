import type { RouteDefinition, RouteParams } from '@core/types';

function generateExecutionId(): string {
  const c = globalThis.crypto;
  if (typeof c?.randomUUID === 'function') return c.randomUUID();
  if (typeof c?.getRandomValues === 'function') {
    const bytes = new Uint8Array(16);
    c.getRandomValues(bytes);
    let out = '';
    for (const b of bytes) out += b.toString(16).padStart(2, '0');
    return out;
  }
  return `${Date.now().toString(16)}-${Math.random().toString(16).slice(2)}`;
}

export class ExecutionContext {
  readonly executionId: string;
  readonly route: RouteDefinition | null;
  readonly params: RouteParams;
  readonly abortController: AbortController;
  readonly startTime: number;
  readonly subscriptions: readonly unknown[];
  readonly container: HTMLElement;

  private cancelled = false;

  constructor(input: { route: RouteDefinition | null; params: RouteParams; container: HTMLElement; startTime?: number }) {
    this.executionId = generateExecutionId();
    this.route = input.route;
    this.params = input.params;
    this.container = input.container;
    this.abortController = new AbortController();
    this.startTime = input.startTime ?? Date.now();
    this.subscriptions = [];
  }

  get signal(): AbortSignal {
    return this.abortController.signal;
  }

  get isCancelled(): boolean {
    return this.cancelled || this.abortController.signal.aborted;
  }

  cancel(): void {
    if (this.cancelled) return;
    this.cancelled = true;
    if (!this.abortController.signal.aborted) this.abortController.abort();
  }
}

