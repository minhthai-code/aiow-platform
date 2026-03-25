/**
 * Experiment Engine — A/B testing + Feature Flags at scale
 *
 * Architecture mirrors how YouTube/Google run experiments:
 *   1. Server injects experiment assignments into the HTML at edge
 *   2. Client reads assignments synchronously on boot (no RTT)
 *   3. Each flag is stable per-user (hash-based bucketing)
 *   4. Assignments are logged to telemetry for metric analysis
 *
 * Flag types:
 *   boolean  — feature on/off
 *   string   — variant selection (e.g. "control" | "treatment_a" | "treatment_b")
 *   number   — numeric config (e.g. prefetch_count: 3)
 */

export type FlagValue = boolean | string | number;

export interface FlagDefinition {
  key:          string;
  defaultValue: FlagValue;
  /** If true, value is read from server-injected window.__EXPERIMENTS__ */
  serverControlled?: boolean;
}

export interface ExperimentAssignment {
  flagKey:    string;
  value:      FlagValue;
  bucketHash: string;
  source:     'server' | 'default' | 'override';
}

// ── Registry ─────────────────────────────────────────────

const _definitions = new Map<string, FlagDefinition>();
const _assignments = new Map<string, ExperimentAssignment>();
const _listeners   = new Map<string, Set<(v: FlagValue) => void>>();

// ── Bucketing ─────────────────────────────────────────────

/** Deterministic user bucketing using djb2 hash — stable across sessions */
function bucket(userId: string | null, flagKey: string): number {
  const input = `${userId ?? 'anon'}:${flagKey}`;
  let hash = 5381;
  for (let i = 0; i < input.length; i++) {
    hash = ((hash << 5) + hash) ^ input.charCodeAt(i);
  }
  return Math.abs(hash) % 100; // 0–99
}

// ── Boot ─────────────────────────────────────────────────

export function initExperiments(userId: string | null): void {
  // Read server-injected assignments (set by edge worker in production)
  const serverAssignments: Record<string, FlagValue> = typeof window !== 'undefined'
    ? (((window as unknown as Record<string, unknown>)['__EXPERIMENTS__'] as Record<string, FlagValue> | undefined) ?? {})
    : {};

  for (const def of _definitions.values()) {
    let value    = def.defaultValue;
    let source: ExperimentAssignment['source'] = 'default';

    if (def.serverControlled && serverAssignments[def.key] !== undefined) {
      value  = serverAssignments[def.key]!;
      source = 'server';
    }

    const b = bucket(userId, def.key).toString();
    _assignments.set(def.key, { flagKey: def.key, value, bucketHash: b, source });
  }

  if (import.meta.env.DEV) {
    console.groupCollapsed('[Experiments] Active flags');
    for (const [k, v] of _assignments) console.log(`  ${k}:`, v.value, `(${v.source})`);
    console.groupEnd();
  }
}

// ── Registration ─────────────────────────────────────────

export function defineFlag(def: FlagDefinition): void {
  _definitions.set(def.key, def);
}

// ── Reading ───────────────────────────────────────────────

export function getFlag(key: string): FlagValue {
  return _assignments.get(key)?.value ?? _definitions.get(key)?.defaultValue ?? false;
}

export function getBoolFlag(key: string): boolean {
  return getFlag(key) === true;
}

export function getStringFlag(key: string): string {
  const v = getFlag(key);
  return typeof v === 'string' ? v : String(v);
}

export function getNumberFlag(key: string): number {
  const v = getFlag(key);
  return typeof v === 'number' ? v : Number(v);
}

/** Override a flag at runtime (dev/QA tool) */
export function overrideFlag(key: string, value: FlagValue): void {
  const prev = _assignments.get(key);
  _assignments.set(key, { flagKey: key, value, bucketHash: '0', source: 'override' });
  if (prev?.value !== value) _listeners.get(key)?.forEach(fn => fn(value));
}

/** Subscribe to flag changes (for live reload in dev) */
export function onFlagChange(key: string, fn: (v: FlagValue) => void): () => void {
  if (!_listeners.has(key)) _listeners.set(key, new Set());
  _listeners.get(key)!.add(fn);
  return () => _listeners.get(key)?.delete(fn);
}

export function getAllAssignments(): ReadonlyMap<string, ExperimentAssignment> {
  return _assignments;
}

// ── Platform flag definitions ─────────────────────────────

defineFlag({ key: 'enable_prefetch',        defaultValue: true,        serverControlled: true  });
defineFlag({ key: 'prefetch_hover_delay_ms',defaultValue: 100,         serverControlled: true  });
defineFlag({ key: 'home_feed_columns',       defaultValue: 'auto',      serverControlled: true  });
defineFlag({ key: 'enable_service_worker',   defaultValue: true,        serverControlled: true  });
defineFlag({ key: 'enable_telemetry',        defaultValue: true,        serverControlled: true  });
defineFlag({ key: 'watch_autoplay',          defaultValue: false,       serverControlled: true  });
defineFlag({ key: 'sidebar_default_collapsed', defaultValue: false,     serverControlled: true  });
defineFlag({ key: 'search_debounce_ms',      defaultValue: 300,         serverControlled: true  });
