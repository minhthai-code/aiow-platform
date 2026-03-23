export interface MetricTags {
  [k: string]: string | number | boolean;
}

export interface MetricRecord {
  name: string;
  value: number;
  tags?: MetricTags;
  ts: number;
}

export class MetricsClient {
  private buffer: MetricRecord[] = [];

  recordMetric(name: string, value: number, tags?: MetricTags): void {
    this.buffer.push({ name, value, tags, ts: Date.now() });
  }

  drain(): MetricRecord[] {
    const out = this.buffer;
    this.buffer = [];
    return out;
  }
}

