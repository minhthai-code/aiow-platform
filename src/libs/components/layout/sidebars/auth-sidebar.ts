import { LitElement, css, html } from 'lit';
import { SidebarBase } from './sidebar-base';

class AuthSecondarySidebar extends SidebarBase {
  static override styles = super.styles as any;

  override render() {
    return html`
      <div class="scroller">
        <!-- Account section -->
        <div class="section-header" @click=${() => this._toggleSection('account')}>
          <span class="section-label">Account</span>
          <div class="chevron ${this._collapsedSections.account ? 'collapsed' : ''}">
            <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M7 10l5 5 5-5z"/></svg>
          </div>
        </div>
        <div class="section-content ${this._collapsedSections.account ? 'collapsed' : ''}">
          <button class="item active" @click=${() => this._nav('/login')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg> Sign In
          </button>
          <button class="item" @click=${() => this._nav('/register')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg> Create Account
          </button>
        </div>

        <!-- More section -->
        <div class="section-header" @click=${() => this._toggleSection('authmore')}>
          <span class="section-label">More</span>
          <div class="chevron ${this._collapsedSections.authmore ? 'collapsed' : ''}">
            <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M7 10l5 5 5-5z"/></svg>
          </div>
        </div>
        <div class="section-content ${this._collapsedSections.authmore ? 'collapsed' : ''}">
          <button class="item"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg> Help</button>
          <button class="item"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/></svg> Privacy</button>
        </div>
      </div>
    `;
  }
}

if (!customElements.get('auth-secondary-sidebar')) customElements.define('auth-secondary-sidebar', AuthSecondarySidebar);

