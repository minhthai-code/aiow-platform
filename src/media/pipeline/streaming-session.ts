export interface StreamingSessionConfig {
  manifestUrl: string;
  autoplay?: boolean;
}

export interface StreamingSession {
  load(config: StreamingSessionConfig): Promise<void>;
  attach(videoElement: HTMLVideoElement): void;
  destroy(): void;
}

