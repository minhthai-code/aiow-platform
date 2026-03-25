export interface RealtimeMessage {
  topic: string;
  payload: unknown;
}

export interface RealtimeConnection {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  subscribe(topic: string, handler: (msg: RealtimeMessage) => void): void;
  publish(topic: string, payload: unknown): void;
}

