import type { SandboxDescriptor, SandboxInstance, SandboxManager } from './sandbox-manager';
import { WorkerSandbox } from '../adapters/worker-sandbox';
import { IframeSandbox } from '../adapters/iframe-sandbox';

export class DefaultSandboxManager implements SandboxManager {
  async create(desc: SandboxDescriptor): Promise<SandboxInstance> {
    if (desc.transport === 'worker') return await WorkerSandbox.create(desc);
    return await IframeSandbox.create(desc);
  }
}

