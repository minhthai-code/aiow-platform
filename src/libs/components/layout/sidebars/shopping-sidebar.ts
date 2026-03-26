import { LitElement, css, html } from 'lit';
import { SidebarBase } from './sidebar-base';

class ShoppingSecondarySidebar extends SidebarBase {
  static override styles = super.styles as any;

  override render() {
    const cats = ['Electronics','Fashion','Home & Garden','Sports','Books','Toys','Health','Automotive'];
    return html`
      <div class="scroller">
        <!-- Shopping section -->
        <div class="section-header" @click=${() => this._toggleSection('shopping')}>
          <span class="section-label">Shopping</span>
          <div class="chevron ${this._collapsedSections.shopping ? 'collapsed' : ''}">
            <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M7 10l5 5 5-5z"/></svg>
          </div>
        </div>
        <div class="section-content ${this._collapsedSections.shopping ? 'collapsed' : ''}">
          <button class="item active" @click=${() => this._nav('/shopping')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg> Home
          </button>
          <button class="item"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z"/></svg> Deals of the Day</button>
          <button class="item"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg> Wishlist <span class="badge">7</span></button>
          <button class="item"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96C5 16.1 6.1 17 7 17h14v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63H19c.75 0 1.41-.41 1.75-1.03l3.58-6.49A1 1 0 0 0 23.45 4H5.21l-.94-2H1z"/></svg> Cart <span class="badge">3</span></button>
          <button class="item"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg> Orders</button>
        </div>

        <!-- Categories section -->
        <div class="section-header" @click=${() => this._toggleSection('shopcats')}>
          <span class="section-label">Categories</span>
          <div class="chevron ${this._collapsedSections.shopcats ? 'collapsed' : ''}">
            <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M7 10l5 5 5-5z"/></svg>
          </div>
        </div>
        <div class="section-content ${this._collapsedSections.shopcats ? 'collapsed' : ''}">
          ${cats.map(c => html`<button class="item" style="padding:6px 10px">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg> ${c}</button>`)}
        </div>
      </div>
    `;
  }
}

if (!customElements.get('shopping-secondary-sidebar')) customElements.define('shopping-secondary-sidebar', ShoppingSecondarySidebar);

