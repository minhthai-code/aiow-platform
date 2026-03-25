export interface MessageBridge {
  send(message: unknown): void;
  onMessage(handler: (message: unknown) => void): void;
}

export class InProcessMessageBridge implements MessageBridge {
  private handler: ((message: unknown) => void) | null = null;

  send(message: unknown): void {
    if (this.handler) this.handler(message);
  }

  onMessage(handler: (message: unknown) => void): void {
    this.handler = handler;
  }
}

