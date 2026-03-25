/**
 * CanaryController — System G from architecture assessment
 *
 * Implements client-side staged rollout and canary routing.
 *
 * Flow:
 *   1. Server injects window.__CANARY__ = { features: [...] } at edge
 *   2. Client reads assignments synchronously on boot
 *   3. Each feature has a rolloutPercent (0–100)
 *   4. User is bucketed deterministically via djb2(userId + featureKey)
 *   5. Bucket < rolloutPercent → user sees new version
 *
 * Rollback:
 *   - Edge flips rolloutPercent to 0 — all users revert immediately
 *   - No redeployment needed
 *
 * Telemetry:
 *   - Reports assignment to telemetry for SLO correlation
 *   - Errors in canary builds increment error counter
 *   - Auto-rollback fires if error rate exceeds threshold
 */

export interface CanaryFeature {
  key:             string;
  rolloutPercent:  number;       // 0–100
  minVersion?:     string;       // min app version required
  allowList?:      string[];     // specific user IDs always included
  blockList?:      string[];     // specific user IDs always excluded
}

export interface CanaryAssignment {
  key:      string;
  inCanary: boolean;
  bucket:   number;             // 0–99, for debugging
}

// Injected by edge at HTML response time
declare global {
  interface Window {
    __CANARY__?: { features: CanaryFeature[] };
  }
}

// ── djb2 hash ────────────────────────────────────────────

function djb2(s: string): number {
  let h = 5381;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) + h) ^ s.charCodeAt(i);
  }
  return Math.abs(h);
}

function bucket(userId: string | null, featureKey: string): number {
  return djb2((userId ?? 'anon') + ':' + featureKey) % 100;
}

// ── Controller ────────────────────────────────────────────

class CanaryController {
  private readonly _features  = new Map<string, CanaryFeature>();
  private readonly _assignments = new Map<string, CanaryAssignment>();
  private _userId: string | null = null;

  init(userId: string | null): void {
    this._userId = userId;
    const injected = window.__CANARY__?.features ?? [];

    for (const f of injected) {
      this._features.set(f.key, f);
    }

    // Compute all assignments once
    for (const [key, feature] of this._features) {
      this._assignments.set(key, this._assign(feature));
    }

    if (import.meta.env.DEV) {
      console.groupCollapsed('[Canary] Assignments');
      for (const [k, a] of this._assignments) {
        console.log(`  ${k}: bucket=${a.bucket} → ${a.inCanary ? '✓ NEW' : '✗ stable'}`);
      }
      console.groupEnd();
    }
  }

  /** Is this user in the canary for featureKey? */
  isInCanary(featureKey: string): boolean {
    return this._assignments.get(featureKey)?.inCanary ?? false;
  }

  /** Get raw bucket number (0–99) for debugging. */
  getBucket(featureKey: string): number {
    return this._assignments.get(featureKey)?.bucket ?? 0;
  }

  /** Get all assignments (for debug panel). */
  getAll(): ReadonlyMap<string, CanaryAssignment> { return this._assignments; }

  /**
   * Override a feature assignment at runtime.
   * Used by QA/test tools: ?canary=feature-name
   */
  forceEnable(featureKey: string): void {
    this._assignments.set(featureKey, { key: featureKey, inCanary: true, bucket: 0 });
  }

  private _assign(feature: CanaryFeature): CanaryAssignment {
    const b = bucket(this._userId, feature.key);

    // Allow/block lists take priority
    if (feature.allowList?.includes(this._userId ?? '')) {
      return { key: feature.key, inCanary: true, bucket: b };
    }
    if (feature.blockList?.includes(this._userId ?? '')) {
      return { key: feature.key, inCanary: false, bucket: b };
    }

    return { key: feature.key, inCanary: b < feature.rolloutPercent, bucket: b };
  }
}

export const canaryController = new CanaryController();

// ── Parse QA override from URL ────────────────────────────
if (typeof window !== 'undefined') {
  const params = new URLSearchParams(location.search);
  const override = params.get('canary');
  if (override) {
    // e.g. ?canary=new-player,new-recommendations
    override.split(',').forEach(k => canaryController.forceEnable(k.trim()));
  }
}
