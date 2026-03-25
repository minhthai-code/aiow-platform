/**
 * ErrorBoundary — catches render errors per-feature, never crashes the shell
 *
 * Each feature module is wrapped in an error boundary.
 * If a feature throws during mount/render, only that feature shows an error UI.
 * The shell, header, sidebar and other features remain unaffected.
 */

import { recordError } from '@platform/telemetry/telemetry';

export interface ErrorBoundaryOptions {
  featureId:  string;
  container:  HTMLElement;
  onRetry?:   () => void;
}

export class ErrorBoundary {
  private readonly opts: ErrorBoundaryOptions;
  private caught = false;

  constructor(opts: ErrorBoundaryOptions) {
    this.opts = opts;
  }

  /** Wrap an async operation — catches and renders error UI on failure */
  async run<T>(fn: () => Promise<T>): Promise<T | null> {
    try {
      const result = await fn();
      this.caught = false;
      return result;
    } catch (err) {
      this._catch(err as Error);
      return null;
    }
  }

  private _catch(err: Error): void {
    this.caught = true;
    const traceId = `err-${Date.now()}-${Math.random().toString(36).slice(2)}`;

    console.error(`[ErrorBoundary:${this.opts.featureId}]`, err);
    recordError(`${this.opts.featureId}: ${err.message}`, traceId);

    this.opts.container.innerHTML = `
      <div style="
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 64px 24px;
        min-height: 300px;
        text-align: center;
        color: #f1f1f1;
        font-family: 'Roboto', system-ui, sans-serif;
      ">
        <svg viewBox="0 0 24 24" width="48" height="48" fill="#717171" style="margin-bottom:16px">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
        </svg>
        <h2 style="font-size:18px;font-weight:500;margin-bottom:8px">Something went wrong</h2>
        <p style="color:#717171;font-size:14px;margin-bottom:24px;max-width:400px">
          ${import.meta.env.DEV ? `<code style="font-size:12px;color:#ff6b6b">${err.message}</code>` : 'We encountered an unexpected error loading this page.'}
        </p>
        <p style="color:#717171;font-size:12px;margin-bottom:24px">Trace: ${traceId}</p>
        <button
          onclick="this.closest('[data-error-boundary]').dispatchEvent(new CustomEvent('retry', { bubbles: true }))"
          style="
            padding: 10px 24px;
            background: #f1f1f1;
            color: #0f0f0f;
            border: none;
            border-radius: 999px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
          "
        >Try again</button>
      </div>`;

    this.opts.container.setAttribute('data-error-boundary', this.opts.featureId);

    if (this.opts.onRetry) {
      this.opts.container.addEventListener('retry', () => {
        this.opts.container.removeAttribute('data-error-boundary');
        this.opts.onRetry?.();
      }, { once: true });
    }
  }

  isCaught(): boolean { return this.caught; }
}
