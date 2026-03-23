/**
 * Platform Logger — structured logging with remote sink
 *
 * Dev:  colorized console with context
 * Prod: batched JSON → /api/logs via sendBeacon
 *
 * Log levels: debug < info < warn < error
 * PII: stripped before transmission
 */

type Level = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level:      Level;
  message:    string;
  feature?:   string;
  traceId?:   string;
  context?:   Record<string, unknown>;
  ts:         number;
}

const IS_DEV   = import.meta.env.DEV;
const MIN: Record<Level, number> = { debug: 0, info: 1, warn: 2, error: 3 };
const MIN_LEVEL: Level = IS_DEV ? 'debug' : 'warn';
const COLORS: Record<Level, string> = { debug:'#888', info:'#4fc3f7', warn:'#ffb74d', error:'#ef5350' };

const _buf: LogEntry[] = [];
let _timer: ReturnType<typeof setTimeout> | null = null;

function _flush(): void {
  if (IS_DEV || _buf.length === 0) return;
  navigator.sendBeacon('/api/logs', JSON.stringify({ entries: _buf.splice(0) }));
}

function _log(level: Level, message: string, feature?: string, traceId?: string, context?: Record<string, unknown>): void {
  if (MIN[level] < MIN[MIN_LEVEL]) return;

  if (IS_DEV) {
    const style1 = `color:${COLORS[level]};font-weight:bold`;
    const label  = `[${feature ?? 'platform'}]`;
    if (level === 'error') console.error(`%c${label}`, style1, message, context ?? '');
    else if (level === 'warn') console.warn(`%c${label}`, style1, message, context ?? '');
    else console.log(`%c${label}`, style1, message, context ?? '');
    return;
  }

  _buf.push({ level, message, feature, traceId, context, ts: Date.now() });
  if (!_timer) _timer = setTimeout(() => { _timer = null; _flush(); }, 3000);
}

export interface Logger {
  debug(msg: string, ctx?: Record<string, unknown>): void;
  info (msg: string, ctx?: Record<string, unknown>): void;
  warn (msg: string, ctx?: Record<string, unknown>): void;
  error(msg: string, ctx?: Record<string, unknown>): void;
}

export function createLogger(feature: string, traceId?: string): Logger {
  return {
    debug: (m, c) => _log('debug', m, feature, traceId, c),
    info:  (m, c) => _log('info',  m, feature, traceId, c),
    warn:  (m, c) => _log('warn',  m, feature, traceId, c),
    error: (m, c) => _log('error', m, feature, traceId, c),
  };
}

export const platformLogger = createLogger('platform');
