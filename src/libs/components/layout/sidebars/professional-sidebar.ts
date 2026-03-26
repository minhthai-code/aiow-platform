import { LitElement, css, html } from 'lit';
import { SidebarBase } from './sidebar-base';

class ProfessionalSecondarySidebar extends SidebarBase {
  static override styles = super.styles as any;

  override render() {
    const a = this._active.bind(this);
    return html`
      <div class="scroller">
        <!-- Professional section -->
        <div class="section-header" @click=${() => this._toggleSection('professional')}>
          <span class="section-label">Professional</span>
          <div class="chevron ${this._collapsedSections.professional ? 'collapsed' : ''}">
            <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M7 10l5 5 5-5z"/></svg>
          </div>
        </div>
        <div class="section-content ${this._collapsedSections.professional ? 'collapsed' : ''}">
          <button class="item ${a('/professional') ? 'active' : ''}" @click=${() => this._nav('/professional')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg> Feed
          </button>
          <button class="item"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg> My Network</button>
          <button class="item"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg> Messaging <span class="badge">2</span></button>
          <button class="item"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/></svg> Notifications <span class="badge">5</span></button>
        </div>

        <!-- Workspace section -->
        <div class="section-header" @click=${() => this._toggleSection('workspace')}>
          <span class="section-label">Workspace</span>
          <div class="chevron ${this._collapsedSections.workspace ? 'collapsed' : ''}">
            <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M7 10l5 5 5-5z"/></svg>
          </div>
        </div>
        <div class="section-content ${this._collapsedSections.workspace ? 'collapsed' : ''}">
          <button class="item"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20 6h-2.18c.07-.44.18-.88.18-1.36C18 2.53 15.48 0 12.35 0c-1.7 0-3.21.94-4.1 2.34L12 6H6L3.56 2.34C2.67.94 1.15 0-.55 0 -3.68 0-6 2.53-6 4.64c0 .48.11.92.18 1.36H-8v14h28V6zm-7.37 12H5v-2h7.63v2zm5.74-2h-4v-2h4v2zm0-4h-8v-2h8v2zm-9.37 0H5v-2h4v2z"/></svg> Jobs</button>
          <button class="item"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg> Articles</button>
          <button class="item"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg> People</button>
          <button class="item"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z"/></svg> Events</button>
        </div>
      </div>
    `;
  }
}

if (!customElements.get('professional-secondary-sidebar')) customElements.define('professional-secondary-sidebar', ProfessionalSecondarySidebar);

