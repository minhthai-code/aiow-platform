import type { MessageBridge } from '@core/sandbox/message-bridge';

export interface SandboxDescriptor {
  id: string;
  transport: 'worker' | 'iframe';
  url: string;
}

export interface SandboxInstance {
  id: string;
  bridge: MessageBridge;
  destroy(): void;
}

export interface SandboxManager {
  create(desc: SandboxDescriptor): Promise<SandboxInstance>;
}

