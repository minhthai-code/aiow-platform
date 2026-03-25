/**
 * <yt-chip> — Reusable filter chip with liquid glass hover
 * Variants: default | active | glass
 */
import { LitElement, html, css } from 'lit';

export class YtChip extends LitElement {
  static override properties = { active: { type: Boolean, reflect: true }, label: { type: String } };
  static override styles = css`
    :host { display: inline-block; }
    button {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 6px 14px; border-radius: var(--r-sm, 8px);
      background: var(--glass-bg, rgba(255,255,255,0.06));
      border: 1px solid var(--bd-1, rgba(255,255,255,0.08));
      color: var(--tx-2, #8a8a8a);
      font-size: 13px; font-weight: 500; font-family: var(--font,inherit);
      cursor: pointer; white-space: nowrap;
      backdrop-filter: blur(var(--glass-blur,12px));
      -webkit-backdrop-filter: blur(var(--glass-blur,12px));
      transition: background var(--dur-fast) var(--ease), color var(--dur-fast) var(--ease),
                  border-color var(--dur-fast) var(--ease), transform var(--dur-fast) var(--ease-spring);
      outline: none;
    }
    button:hover {
      background: var(--glass-shine, rgba(255,255,255,0.18));
      border-color: var(--bd-2, rgba(255,255,255,0.14));
      color: var(--tx-1, #f2f2f2);
    }
    button:active { transform: scale(0.96); }
    :host([active]) button {
      background: var(--tx-1, #f2f2f2);
      border-color: transparent;
      color: var(--tx-inv, #0a0a0a);
      font-weight: 600;
    }
    :host([active]) button:hover { background: var(--tx-1); opacity: 0.9; }
  `;
  active = false;
  label = '';
  override render() {
    return html`<button part="chip" @click=${() => this.dispatchEvent(new CustomEvent('chip-click', { bubbles: true, composed: true }))}><slot>${this.label}</slot></button>`;
  }
}
if (!customElements.get('yt-chip')) customElements.define('yt-chip', YtChip);
