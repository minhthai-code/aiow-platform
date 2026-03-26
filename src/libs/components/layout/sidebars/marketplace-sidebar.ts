import { LitElement, css, html } from 'lit';
import { SidebarBase } from './sidebar-base';

class MarketplaceSecondarySidebar extends SidebarBase {
  static override styles = super.styles as any;

  override render() {
    return html`
      <div class="scroller">
        <!-- Marketplace section -->
        <div class="section-header" @click=${() => this._toggleSection('marketplace')}>
          <span class="section-label">Marketplace</span>
          <div class="chevron ${this._collapsedSections.marketplace ? 'collapsed' : ''}">
            <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M7 10l5 5 5-5z"/></svg>
          </div>
        </div>
        <div class="section-content ${this._collapsedSections.marketplace ? 'collapsed' : ''}">
          <button class="item active" @click=${() => this._nav('/marketplace')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg> Browse
          </button>
          <button class="item"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg> Featured</button>
          <button class="item"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z"/></svg> Saved Searches</button>
          <button class="item"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/></svg> My Listings</button>
        </div>

        <!-- Categories section -->
        <div class="section-header" @click=${() => this._toggleSection('marketcats')}>
          <span class="section-label">Categories</span>
          <div class="chevron ${this._collapsedSections.marketcats ? 'collapsed' : ''}">
            <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M7 10l5 5 5-5z"/></svg>
          </div>
        </div>
        <div class="section-content ${this._collapsedSections.marketcats ? 'collapsed' : ''}">
          ${['Vehicles','Real Estate','Electronics','Clothing','Furniture','Garden','Sports','Free items'].map(c => html`
            <button class="item" style="padding:6px 10px">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg> ${c}</button>`)}
        </div>
      </div>
    `;
  }
}

if (!customElements.get('marketplace-secondary-sidebar')) customElements.define('marketplace-secondary-sidebar', MarketplaceSecondarySidebar);

