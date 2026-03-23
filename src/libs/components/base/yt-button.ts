/**
 * <yt-button> — Reusable button: variant="primary|secondary|ghost|glass|danger"
 */
import { LitElement, html, css } from 'lit';
export class YtButton extends LitElement {
  static override properties = { variant: { type: String }, size: { type: String }, disabled: { type: Boolean, reflect: true } };
  static override styles = css`
    :host { display: inline-block; }
    button {
      display: inline-flex; align-items: center; justify-content: center; gap: 6px;
      padding: 8px 18px; border-radius: var(--r-full,9999px);
      font-size: 13px; font-weight: 600; font-family: var(--font,inherit);
      cursor: pointer; border: none; outline: none; white-space: nowrap;
      transition: opacity var(--dur-fast) var(--ease), transform var(--dur-fast) var(--ease-spring),
                  background var(--dur-fast) var(--ease);
    }
    button:active  { transform: scale(0.95); }
    button:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }
    /* primary */
    :host([variant="primary"]) button { background: var(--tx-1,#f2f2f2); color: var(--tx-inv,#0a0a0a); }
    :host([variant="primary"]) button:hover:not(:disabled) { opacity: 0.88; }
    /* secondary */
    :host([variant="secondary"]) button { background: var(--bg-overlay,#1e1e1e); border: 1px solid var(--bd-1); color: var(--tx-2,#8a8a8a); }
    :host([variant="secondary"]) button:hover:not(:disabled) { border-color: var(--bd-2); color: var(--tx-1); }
    /* ghost */
    :host([variant="ghost"]) button { background: transparent; color: var(--tx-2); }
    :host([variant="ghost"]) button:hover:not(:disabled) { background: var(--bg-hover); color: var(--tx-1); }
    /* glass */
    :host([variant="glass"]) button {
      background: var(--glass-bg); border: 1px solid var(--glass-border);
      color: var(--tx-1); backdrop-filter: blur(var(--glass-blur,12px));
      -webkit-backdrop-filter: blur(var(--glass-blur,12px));
    }
    :host([variant="glass"]) button:hover:not(:disabled) { background: var(--glass-shine); }
    /* icon-only */
    :host([size="icon"]) button { padding: 8px; border-radius: var(--r-md,12px); width: 36px; height: 36px; }
    :host([size="sm"]) button { padding: 5px 12px; font-size: 12px; }
  `;
  variant = 'secondary';
  size = 'md';
  disabled = false;
  override render() {
    return html`<button part="btn" ?disabled=${this.disabled}><slot></slot></button>`;
  }
}
if (!customElements.get('yt-button')) customElements.define('yt-button', YtButton);
