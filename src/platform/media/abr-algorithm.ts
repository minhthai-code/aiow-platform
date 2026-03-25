export interface AbrDecision {
  bitrate: number;
}

export function chooseBitrate(_bandwidthKbps: number): AbrDecision {
  // Placeholder ABR strategy
  return { bitrate: 1000 };
}

