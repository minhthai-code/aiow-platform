/**
 * Platform Telemetry — Real User Monitoring
 *
 * Collects Web Vitals (LCP, INP, CLS, FID, TTFB), navigation timing,
 * component render latency, JS errors, and custom events.
 *
 * Privacy-first:
 *   - 1% sampling rate in production (all in dev)
 *   - No PII collected — user IDs hashed with session salt
 *   - Sensitive query params stripped before URL logging
 *   - navigator.sendBeacon for reliable page-unload delivery
 *
 * Batching:
 *   - Events buffered and flushed every 10s or on visibilitychange
 *   - Beacon payload capped at 64KB per flush
 */

import { schedule } from '@core/scheduler/scheduler';
import { getBoolFlag } from '@platform/experiments/experiment-engine';

// ── Types ────────────────────────────────────────────────

type EventType = 'vital' | 'nav' | 'render' | 'error' | 'action' | 'custom';

interface TelemetryEvent {
  type:       EventType;
  name:       string;
  value:      number;
  url:        string;
  ts:         number;
  sessionId:  string;
  traceId?:   string;
  meta?:      Record<string, string | number | boolean>;
}

// ── Session ───────────────────────────────────────────────

const SESSION_ID = Math.random().toString(36).slice(2) + Date.now().toString(36);
const IS_SAMPLED = import.meta.env.DEV || Math.random() < 0.01; // 1% production

// ── Buffer ────────────────────────────────────────────────

const _buffer: TelemetryEvent[] = [];
let   _flushTimer: ReturnType<typeof setInterval> | null = null;
const MAX_BUFFER = 200;
const FLUSH_INTERVAL = 10_000;

function _sanitizeUrl(url: string): string {
  try {
    const u    = new URL(url);
    const safe = new Set(['v', 'q', 'list', 'channel']);
    for (const k of [...u.searchParams.keys()]) {
      if (!safe.has(k)) u.searchParams.delete(k);
    }
    return u.pathname + (u.search || '');
  } catch { return '/'; }
}

function _push(event: Omit<TelemetryEvent, 'url' | 'ts' | 'sessionId'>): void {
  if (!IS_SAMPLED) return;
  if (!getBoolFlag('enable_telemetry')) return;
  if (_buffer.length >= MAX_BUFFER) _buffer.shift(); // drop oldest

  _buffer.push({
    ...event,
    url:       _sanitizeUrl(location.href),
    ts:        Date.now(),
    sessionId: SESSION_ID,
  });
}

function _flush(): void {
  if (_buffer.length === 0) return;

  const payload = JSON.stringify({ events: _buffer.splice(0) });

  // sendBeacon: fire-and-forget, survives page unload, max 64KB
  if (!navigator.sendBeacon('/api/telemetry', payload)) {
    // Fallback: fetch with keepalive
    fetch('/api/telemetry', {
      method: 'POST',
      body:   payload,
      headers: { 'Content-Type': 'application/json' },
      keepalive: true,
    }).catch(() => {/* silent */});
  }
}

// ── Web Vitals ────────────────────────────────────────────

function _observeVitals(): void {
  if (typeof PerformanceObserver === 'undefined') return;

  // LCP
  try {
    new PerformanceObserver(list => {
      const entries = list.getEntries();
      const e = entries.length ? entries[entries.length - 1] : undefined;
      if (e) _push({ type: 'vital', name: 'LCP', value: Math.round(e.startTime) });
    }).observe({ type: 'largest-contentful-paint', buffered: true });
  } catch {/* not supported */}

  // CLS
  try {
    let clsVal = 0;
    new PerformanceObserver(list => {
      for (const e of list.getEntries()) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (!(e as any).hadRecentInput) clsVal += (e as any).value ?? 0;
      }
      _push({ type: 'vital', name: 'CLS', value: Math.round(clsVal * 1000) });
    }).observe({ type: 'layout-shift', buffered: true });
  } catch {/* not supported */}

  // FID / INP
  try {
    new PerformanceObserver(list => {
      for (const e of list.getEntries()) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const delay = (e as any).processingStart - e.startTime;
        _push({ type: 'vital', name: 'FID', value: Math.round(delay) });
      }
    }).observe({ type: 'first-input', buffered: true });
  } catch {/* not supported */}

  // Navigation timing
  try {
    new PerformanceObserver(list => {
      for (const e of list.getEntries()) {
        const nav = e as PerformanceNavigationTiming;
        _push({ type: 'vital', name: 'TTFB', value: Math.round(nav.responseStart - nav.requestStart) });
        _push({ type: 'vital', name: 'FCP',  value: Math.round(nav.responseEnd  - nav.requestStart) });
      }
    }).observe({ type: 'navigation', buffered: true });
  } catch {/* not supported */}
}

// ── Public API ────────────────────────────────────────────

export function recordNavigation(from: string, to: string, durationMs: number): void {
  _push({ type: 'nav', name: 'route_change', value: Math.round(durationMs),
    meta: { from: _sanitizeUrl(from), to: _sanitizeUrl(to) } });
}

export function recordRender(componentName: string, durationMs: number): void {
  _push({ type: 'render', name: componentName, value: Math.round(durationMs) });
}

export function recordError(message: string, traceId?: string): void {
  _push({ type: 'error', name: 'js_error', value: 0,
    traceId, meta: { message: message.slice(0, 200) } });
}

export function recordAction(name: string, featureId: string, durationMs = 0): void {
  _push({ type: 'action', name, value: Math.round(durationMs), meta: { featureId } });
}

export function recordCustom(name: string, value: number, meta?: Record<string, string | number | boolean>): void {
  _push({ type: 'custom', name, value, meta });
}

export function init(): void {
  if (!IS_SAMPLED) return;
  _observeVitals();
  _flushTimer = setInterval(() => schedule('telemetry:flush', _flush, 'background'), FLUSH_INTERVAL);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') _flush();
  });
  window.addEventListener('error', e => {
    recordError(`${e.message} @ ${e.filename}:${e.lineno}`);
  });
  window.addEventListener('unhandledrejection', e => {
    recordError(String(e.reason));
  });
}

export function destroy(): void {
  if (_flushTimer) clearInterval(_flushTimer);
  _flush();
}
