import { InProcessMessageBridge, type MessageBridge } from '@core/sandbox/message-bridge';
import type { SandboxDescriptor, SandboxInstance } from '../runtime/sandbox-manager';

export class IframeSandbox implements SandboxInstance {
  public readonly bridge: MessageBridge = new InProcessMessageBridge();
  private iframe: HTMLIFrameElement | null = null;

  constructor(public readonly id: string) {}

  static async create(desc: SandboxDescriptor): Promise<IframeSandbox> {
    const inst = new IframeSandbox(desc.id);
    const iframe = document.createElement('iframe');
    iframe.src = desc.url;
    iframe.sandbox.add('allow-scripts');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
    inst.iframe = iframe;

    window.addEventListener('message', e => {
      if (e.source === iframe.contentWindow) inst.bridge.send(e.data);
    });

    inst.bridge.onMessage(msg => iframe.contentWindow?.postMessage(msg, '*'));
    return inst;
  }

  destroy(): void {
    if (this.iframe?.parentNode) this.iframe.parentNode.removeChild(this.iframe);
    this.iframe = null;
  }
}

