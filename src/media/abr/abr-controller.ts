export interface AbrSample {
  bandwidthKbps: number;
}

export interface AbrDecision {
  bitrate: number;
}

export class AbrController {
  decide(sample: AbrSample): AbrDecision {
    // Minimal placeholder: choose a conservative bitrate.
    return { bitrate: Math.max(250, Math.min(2500, Math.round(sample.bandwidthKbps * 0.7))) };
  }
}

