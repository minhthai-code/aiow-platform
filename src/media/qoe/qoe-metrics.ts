export interface QoeEvent {
  name: string;
  value?: number;
  meta?: Record<string, string | number | boolean>;
}

export class QoeMetrics {
  record(_event: QoeEvent): void {
    // placeholder: wire to observability in future
  }
}

