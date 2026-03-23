import type { RealtimeConnection, RealtimeMessage } from './realtime-connection';

export class WebSocketRealtimeConnection implements RealtimeConnection {
  private ws: WebSocket | null = null;
  private handlers = new Map<string, Set<(msg: RealtimeMessage) => void>>();

  constructor(private readonly url: string) {}

  async connect(): Promise<void> {
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) return;
    this.ws = new WebSocket(this.url);
    this.ws.onmessage = e => {
      try {
        const msg = JSON.parse(String(e.data)) as RealtimeMessage;
        this.handlers.get(msg.topic)?.forEach(h => h(msg));
      } catch {
        // ignore malformed messages
      }
    };
    await new Promise<void>((resolve, reject) => {
      if (!this.ws) return reject(new Error('WebSocket not created'));
      this.ws.onopen = () => resolve();
      this.ws.onerror = () => reject(new Error('WebSocket error'));
    });
  }

  async disconnect(): Promise<void> {
    if (!this.ws) return;
    this.ws.close();
    this.ws = null;
  }

  subscribe(topic: string, handler: (msg: RealtimeMessage) => void): void {
    if (!this.handlers.has(topic)) this.handlers.set(topic, new Set());
    this.handlers.get(topic)!.add(handler);
  }

  publish(topic: string, payload: unknown): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;
    this.ws.send(JSON.stringify({ topic, payload }));
  }
}

