export class BroadcastChannelSync {
  private channel: BroadcastChannel | null = null;

  constructor(name: string) {
    if (typeof BroadcastChannel !== 'undefined') {
      this.channel = new BroadcastChannel(name);
    }
  }

  post(message: unknown): void {
    this.channel?.postMessage(message);
  }

  onMessage(handler: (message: unknown) => void): void {
    if (!this.channel) return;
    this.channel.onmessage = e => handler(e.data);
  }
}

