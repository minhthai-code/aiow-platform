/** <yt-skeleton> — shimmer loading placeholder */
import { LitElement, html, css } from 'lit';
export class YtSkeleton extends LitElement {
  static override properties = { width: { type: String }, height: { type: String }, radius: { type: String }, circle: { type: Boolean } };
  static override styles = css`
    :host { display: block; }
    .sk {
      width: var(--sk-w, 100%); height: var(--sk-h, 14px);
      border-radius: var(--sk-r, var(--r-xs, 4px));
      background: linear-gradient(90deg, var(--bg-raised,#171717) 25%, var(--bg-overlay,#1e1e1e) 50%, var(--bg-raised,#171717) 75%);
      background-size: 200% 100%;
      animation: sh 1.8s ease infinite;
    }
    :host([circle]) .sk { border-radius: 50%; }
    @keyframes sh { 0%{background-position:200% 0}100%{background-position:-200% 0} }
  `;
  width  = '100%';
  height = '14px';
  radius = 'var(--r-xs,4px)';
  circle = false;
  override render() {
    return html`<div class="sk" style="--sk-w:${this.width};--sk-h:${this.height};--sk-r:${this.radius}"></div>`;
  }
}
if (!customElements.get('yt-skeleton')) customElements.define('yt-skeleton', YtSkeleton);
