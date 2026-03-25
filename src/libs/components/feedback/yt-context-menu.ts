/**
 * <yt-context-menu> — Apple-glass floating context menu
 * Triggered by 3-dot button on video cards
 */
import { LitElement, html, css } from 'lit';
export class YtContextMenu extends LitElement {
  static override properties = { open: { type: Boolean, reflect: true }, x: { type: Number }, y: { type: Number } };
  static override styles = css`
    :host { display: block; }
    .backdrop {
      position: fixed; inset: 0; z-index: var(--z-overlay, 300);
      background: transparent;
    }
    .menu {
      position: fixed;
      z-index: calc(var(--z-overlay,300) + 1);
      min-width: 200px;
      background: var(--glass-bg, rgba(20,20,20,0.82));
      border: 1px solid var(--glass-border, rgba(255,255,255,0.12));
      border-radius: var(--r-xl, 20px);
      backdrop-filter: blur(28px) saturate(160%);
      -webkit-backdrop-filter: blur(28px) saturate(160%);
      box-shadow: 0 8px 40px rgba(0,0,0,0.6), 0 0 0 0.5px rgba(255,255,255,0.06) inset;
      padding: 6px;
      transform-origin: top left;
      animation: menuIn var(--dur-mid,180ms) var(--ease-spring) forwards;
      overflow: hidden;
    }
    @keyframes menuIn {
      from { opacity:0; transform: scale(0.88) translateY(-8px); }
      to   { opacity:1; transform: scale(1) translateY(0); }
    }
    .item {
      display: flex; align-items: center; gap: 10px;
      padding: 9px 12px;
      border-radius: var(--r-md, 12px);
      color: var(--tx-1, #f2f2f2);
      font-size: 13px; font-weight: 500; font-family: var(--font,inherit);
      cursor: pointer; border: none; background: none; width: 100%; text-align: left;
      transition: background var(--dur-fast) var(--ease);
    }
    .item:hover { background: var(--bg-hover, rgba(255,255,255,0.08)); }
    .item.danger { color: #ff453a; }
    .item svg   { flex-shrink: 0; opacity: 0.7; }
    .sep {
      height: 1px;
      background: var(--bd-1, rgba(255,255,255,0.08));
      margin: 4px 6px;
    }
  `;

  open = false;
  x = 0;
  y = 0;

  private _close(): void { this.open = false; this.dispatchEvent(new CustomEvent('close', { bubbles: true, composed: true })); }

  override render() {
    if (!this.open) return html``;
    const style = `left:${this.x}px;top:${this.y}px`;
    return html`
      <div class="backdrop" @click=${this._close.bind(this)}></div>
      <div class="menu" style="${style}">
        ${this._item('M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z','Save to Watch later')}
        ${this._item('M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H9V9h10v2zm-4 4H9v-2h6v2zm4-8H9V5h10v2z','Save to playlist')}
        ${this._item('M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92c0-1.61-1.31-2.92-2.92-2.92z','Share')}
        <div class="sep"></div>
        ${this._item('M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z','Not interested', false, true)}
        ${this._item('M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z','Add to queue')}
      </div>`;
  }

  private _item(iconPath: string, label: string, _active = false, danger = false) {
    return html`
      <button class="item ${danger ? 'danger' : ''}" @click=${this._close.bind(this)}>
        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="${iconPath}"/></svg>
        ${label}
      </button>`;
  }
}
if (!customElements.get('yt-context-menu')) customElements.define('yt-context-menu', YtContextMenu);
