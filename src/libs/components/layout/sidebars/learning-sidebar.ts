import { LitElement, css, html } from 'lit';
import { SidebarBase } from './sidebar-base';

class LearningSecondarySidebar extends SidebarBase {
  static override styles = super.styles as any;

  override render() {
    return html`
      <div class="scroller">
        <!-- Learning section -->
        <div class="section-header" @click=${() => this._toggleSection('learning')}>
          <span class="section-label">Learning</span>
          <div class="chevron ${this._collapsedSections.learning ? 'collapsed' : ''}">
            <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M7 10l5 5 5-5z"/></svg>
          </div>
        </div>
        <div class="section-content ${this._collapsedSections.learning ? 'collapsed' : ''}">
          <button class="item active" @click=${() => this._nav('/learning')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg> Dashboard
          </button>
          <button class="item"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg> My Courses <span class="badge">4</span></button>
          <button class="item"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z"/></svg> Bookmarks</button>
          <button class="item"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg> Certificates</button>
        </div>

        <!-- Categories section -->
        <div class="section-header" @click=${() => this._toggleSection('categories')}>
          <span class="section-label">Categories</span>
          <div class="chevron ${this._collapsedSections.categories ? 'collapsed' : ''}">
            <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M7 10l5 5 5-5z"/></svg>
          </div>
        </div>
        <div class="section-content ${this._collapsedSections.categories ? 'collapsed' : ''}">
          ${['Development','Design','Data Science','Business','Marketing','Photography'].map(c => html`
            <button class="item"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3L2 8l10 5 10-5-10-5zm-8 7v5l8 4 8-4v-5l-8 4-8-4z"/></svg> ${c}</button>`)}
        </div>
      </div>
    `;
  }
}

if (!customElements.get('learning-secondary-sidebar')) customElements.define('learning-secondary-sidebar', LearningSecondarySidebar);

