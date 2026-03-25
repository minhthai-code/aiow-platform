/** <yt-badge> — small count/status indicator */
import { LitElement, html, css } from 'lit';
export class YtBadge extends LitElement {
  static override properties = { count: { type: Number }, variant: { type: String } };
  static override styles = css`
    :host { display: inline-flex; align-items: center; justify-content: center; }
    .badge {
      min-width: 18px; height: 18px; padding: 0 5px;
      border-radius: var(--r-full); font-size: 11px; font-weight: 700;
      display: flex; align-items: center; justify-content: center;
    }
    :host([variant="error"])   .badge { background: var(--brand,#ff0000); color: #fff; }
    :host([variant="success"]) .badge { background: #22c55e; color: #fff; }
    :host([variant="neutral"]) .badge { background: var(--bg-overlay); color: var(--tx-2); border: 1px solid var(--bd-1); }
  `;
  count = 0;
  variant = 'error';
  override render() {
    if (!this.count) return html``;
    return html`<span class="badge">${this.count > 99 ? '99+' : this.count}</span>`;
  }
}
if (!customElements.get('yt-badge')) customElements.define('yt-badge', YtBadge);
