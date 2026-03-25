import { LitElement, css, html } from 'lit';
import { SidebarBase } from './sidebar-base';

class MapsSecondarySidebar extends SidebarBase {
  static override styles = super.styles as any;

  override render() {
    return html`
      <div class="scroller">
        <!-- Maps section -->
        <div class="section-header" @click=${() => this._toggleSection('maps')}>
          <span class="section-label">Maps</span>
          <div class="chevron ${this._collapsedSections.maps ? 'collapsed' : ''}">
            <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M7 10l5 5 5-5z"/></svg>
          </div>
        </div>
        <div class="section-content ${this._collapsedSections.maps ? 'collapsed' : ''}">
          <button class="item active" @click=${() => this._nav('/maps')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg> Explore
          </button>
          <button class="item"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M21.43 15.58l-3.13-3.13-2.12 2.12 3.13 3.13-1.87 1.87L21 23.7 23.3 21.44l-1.87-1.86zM2.56 8.42l3.13 3.13 2.12-2.12L4.68 6.3 6.55 4.43 2 2.13.14 4.39l2.42 4.03zM18 3H6c-1.1 0-2 .9-2 2v14l7-3 7 3V5c0-1.1-.9-2-2-2z"/></svg> Saved Places</button>
          <button class="item"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/></svg> Nearby</button>
        </div>

        <!-- Directions section -->
        <div class="section-header" @click=${() => this._toggleSection('directions')}>
          <span class="section-label">Directions</span>
          <div class="chevron ${this._collapsedSections.directions ? 'collapsed' : ''}">
            <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M7 10l5 5 5-5z"/></svg>
          </div>
        </div>
        <div class="section-content ${this._collapsedSections.directions ? 'collapsed' : ''}">
          <button class="item"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99z"/></svg> Driving</button>
          <button class="item"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M13.49 5.48c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm-3.6 13.9l1-4.4 2.1 2v6h2v-7.5l-2.1-2 .6-3c1.3 1.5 3.3 2.5 5.5 2.5v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1l-5.2 2.2v4.7h2v-3.4l1.8-.7-1.6 8.1-4.9-1-.4 2 7 1.4z"/></svg> Walking</button>
          <button class="item"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M4 16c0 .88.39 1.67 1 2.22V20c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h8v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10z"/></svg> Transit</button>
        </div>

        <!-- Layers section -->
        <div class="section-header" @click=${() => this._toggleSection('layers')}>
          <span class="section-label">Layers</span>
          <div class="chevron ${this._collapsedSections.layers ? 'collapsed' : ''}">
            <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M7 10l5 5 5-5z"/></svg>
          </div>
        </div>
        <div class="section-content ${this._collapsedSections.layers ? 'collapsed' : ''}">
          <button class="item"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M11.99 18.54l-7.37-5.73L3 14.07l9 7 9-7-1.63-1.27-7.38 5.74zM12 16l7.36-5.73L21 9l-9-7-9 7 1.63 1.27L12 16z"/></svg> Traffic</button>
          <button class="item"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M21.9 21.9l-8.49-8.49-9.82-9.82L2.1 2.1.69 3.51 3 5.83V19c0 1.1.9 2 2 2h13.17l2.31 2.31 1.42-1.41z"/></svg> Satellite</button>
        </div>
      </div>
    `;
  }
}

if (!customElements.get('maps-secondary-sidebar')) customElements.define('maps-secondary-sidebar', MapsSecondarySidebar);

