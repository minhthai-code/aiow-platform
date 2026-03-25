/**
 * <yt-input> — Reusable text input with glass styling
 */
import { LitElement, html, css } from 'lit';
export class YtInput extends LitElement {
  static override properties = { placeholder: { type: String }, value: { type: String }, type: { type: String } };
  static override styles = css`
    :host { display: block; }
    input {
      width: 100%; height: 40px; padding: 0 16px;
      background: var(--glass-bg, rgba(255,255,255,0.06));
      border: 1.5px solid var(--bd-1, rgba(255,255,255,0.08));
      border-radius: var(--r-full, 9999px);
      color: var(--tx-1, #f2f2f2); font-size: 14px; font-family: var(--font,inherit);
      outline: none;
      backdrop-filter: blur(var(--glass-blur,12px));
      -webkit-backdrop-filter: blur(var(--glass-blur,12px));
      transition: border-color var(--dur-fast) var(--ease), background var(--dur-fast) var(--ease);
    }
    input::placeholder { color: var(--tx-3, #4a4a4a); }
    input:focus { border-color: var(--bd-3, rgba(255,255,255,0.22)); background: var(--glass-shine,rgba(255,255,255,0.14)); }
    input[type="search"]::-webkit-search-cancel-button { display: none; }
  `;
  placeholder = '';
  value = '';
  type = 'text';
  override render() {
    return html`<input part="input" type=${this.type} placeholder=${this.placeholder} .value=${this.value}
      @input=${(e: InputEvent) => { this.value = (e.target as HTMLInputElement).value; this.dispatchEvent(new CustomEvent('yt-input', { detail: this.value, bubbles: true, composed: true })); }}
      @keydown=${(e: KeyboardEvent) => { if (e.key==='Enter') this.dispatchEvent(new CustomEvent('yt-enter', { detail: this.value, bubbles: true, composed: true })); }}
    />`;
  }
}
if (!customElements.get('yt-input')) customElements.define('yt-input', YtInput);
