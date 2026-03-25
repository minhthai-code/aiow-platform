import { InProcessMessageBridge, type MessageBridge } from '@core/sandbox/message-bridge';
import type { SandboxDescriptor, SandboxInstance } from '../runtime/sandbox-manager';

export class WorkerSandbox implements SandboxInstance {
  public readonly bridge: MessageBridge = new InProcessMessageBridge();
  private worker: Worker | null = null;

  constructor(public readonly id: string) {}

  static async create(desc: SandboxDescriptor): Promise<WorkerSandbox> {
    const inst = new WorkerSandbox(desc.id);
    inst.worker = new Worker(desc.url, { type: 'module' });
    inst.worker.onmessage = e => inst.bridge.send(e.data);
    inst.bridge.onMessage(msg => inst.worker?.postMessage(msg));
    return inst;
  }

  destroy(): void {
    this.worker?.terminate();
    this.worker = null;
  }
}
