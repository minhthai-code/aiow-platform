import { LitElement } from 'lit';
import { schedule } from '@core/scheduler/scheduler';
import { on, offAll } from '@core/runtime-api/event-bus';
import type { TaskPriority, PlatformEventType, EventListener } from '@core/types';

// ── Service Registry (DI) ────────────────────────────────

const serviceRegistry = new Map<string, unknown>();

export function registerService<T>(name: string, instance: T): void {
  serviceRegistry.set(name, instance);
}

export function getRegisteredService<T>(name: string): T {
  const svc = serviceRegistry.get(name);
  if (!svc) throw new Error(`[Platform] Service not registered: "${name}"`);
  return svc as T;
}

// ── PlatformElement ──────────────────────────────────────

export abstract class PlatformElement extends LitElement {
  protected renderPriority: TaskPriority = 'user-visible';

  private readonly _instanceId =
    `${this.tagName.toLowerCase()}:${Math.random().toString(36).slice(2)}`;

  override connectedCallback(): void {
    super.connectedCallback();
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    offAll(this._instanceId);
  }

  protected override scheduleUpdate(): Promise<unknown> {
    return new Promise<void>(resolve => {
      schedule(
        `render:${this._instanceId}`,
        () => {
          const result = super.scheduleUpdate();
          if (result && typeof (result as Promise<unknown>).then === 'function') {
            (result as Promise<unknown>).then(() => resolve());
          } else {
            resolve();
          }
        },
        this.renderPriority,
      );
    });
  }

  protected getService<T>(name: string): T {
    return getRegisteredService<T>(name);
  }

  protected listenOn<T extends PlatformEventType>(
    event: T,
    listener: EventListener<T>,
  ): void {
    on(event, listener, this._instanceId);
  }
}
