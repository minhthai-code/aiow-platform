import { LitElement, css, html } from 'lit';
import { SidebarBase } from './sidebar-base';

class FbSecondarySidebar extends SidebarBase {
  static override styles = [
    ...super.styles,
    css`
      .section-label {
        letter-spacing: 0.6px;
        color: #8e8e93;
      }
      .item {
        padding: 9px 12px;
        margin: 3px 0;
        border-radius: 12px;
      }
      .item.active::before {
        width: 4px;
        height: 26px;
        left: -10px;
        background: #1877f2;
        border-radius: 4px;
      }
      .section-content .item:first-of-type {
        margin-top: 4px;
      }
    `
  ];

  override render() {
    const a = this._active.bind(this);
    
    return html`
      <div class="scroller">
        <!-- Main Feed Section -->
        <div class="section-header" @click=${() => this._toggleSection('feed')}>
          <span class="section-label">Feed</span>
          <div class="chevron ${this._collapsedSections.feed ? 'collapsed' : ''}">
            <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M7 10l5 5 5-5z"/></svg>
          </div>
        </div>
        <div class="section-content ${this._collapsedSections.feed ? 'collapsed' : ''}">
          <button class="item ${a('/social') ? 'active' : ''}" @click=${() => this._nav('/social')}>
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 3h8v8H3zm10 0h8v8h-8zM3 13h8v8H3zm13 0h-3v3h-3v2h3v3h2v-3h3v-2h-3z"/></svg> 
            Timeline
          </button>
          <button class="item">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-8 2h6v2h-6V6zm0 4h6v2h-6v-2zm-6 0h4v2H6v-2zm10 8H6v-2h10v2zm4-4h-4v-2h4v2zm0-4h-4v-2h4v2z"/></svg>
            Recent
          </button>
          <button class="item">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z"/></svg>
            Saved
          </button>
          <button class="item">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>
            Messages
            <span class="notification-badge">5</span>
          </button>
        </div>

        <!-- Communities Section -->
        <div class="section-header" @click=${() => this._toggleSection('communities')}>
          <span class="section-label">Communities</span>
          <div class="chevron ${this._collapsedSections.communities ? 'collapsed' : ''}">
            <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M7 10l5 5 5-5z"/></svg>
          </div>
        </div>
        <div class="section-content ${this._collapsedSections.communities ? 'collapsed' : ''}">
          <button class="item">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/></svg>
            My Groups
            <span class="notification-badge">8</span>
          </button>
          <button class="item">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
            Discover Groups
          </button>
          <button class="item">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14h-2v-4H8v-2h2V9h2v2h2v2h-2v4z"/></svg>
            Create Group
          </button>
        </div>

        <!-- Explore Section -->
        <div class="section-header" @click=${() => this._toggleSection('explore')}>
          <span class="section-label">Explore</span>
          <div class="chevron ${this._collapsedSections.explore ? 'collapsed' : ''}">
            <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M7 10l5 5 5-5z"/></svg>
          </div>
        </div>
        <div class="section-content ${this._collapsedSections.explore ? 'collapsed' : ''}">
          <button class="item">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.53 11.2c-.23-.3-.5-.56-.76-.82-.65-.6-1.4-1.03-2.03-1.66-1.46-1.46-1.78-3.87-.85-5.72-.9.23-1.75.75-2.45 1.32C9.18 6.4 7.84 9.19 7.93 12c.02.48-.04.96-.22 1.4-.2.47-.52.88-.93 1.18-.07.05-.14.09-.2.14-.03-.5-.06-1-.01-1.5.06-.6.2-1.16.49-1.67a5.37 5.37 0 0 0-.78 2.61c-.04.3-.02.62-.01.92.01.29.04.58.09.87.08.57.23 1.13.47 1.66A6.92 6.92 0 0 0 12 22c3.87 0 7-3.13 7-7 .01-1.35-.38-2.62-1.47-3.8z"/></svg>
            Trending Topics
          </button>
          <button class="item">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
            Events Near You
          </button>
          <button class="item">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M21 6H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-10 7H8v3H6v-3H3v-2h3V8h2v3h3v2z"/></svg>
            Local
          </button>
          <button class="item">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14h-2v-4H8v-2h2V9h2v2h2v2h-2v4z"/></svg>
            Interests
          </button>
        </div>

        <!-- Settings -->
        <div class="section-header" @click=${() => this._toggleSection('settings')}>
          <span class="section-label">Settings</span>
          <div class="chevron ${this._collapsedSections.settings ? 'collapsed' : ''}">
            <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M7 10l5 5 5-5z"/></svg>
          </div>
        </div>
        <div class="section-content ${this._collapsedSections.settings ? 'collapsed' : ''}">
          <button class="item">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94 0 .31.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.57 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-2 0-3.6-1.6-3.6-3.6s1.6-3.6 3.6-3.6 3.6 1.6 3.6 3.6-1.6 3.6-3.6 3.6z"/></svg>
            Account Settings
          </button>
          <button class="item">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
            Help & Support
          </button>
          <button class="item">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z"/></svg>
            Privacy
          </button>
        </div>
      </div>
    `;
  }
}

if (!customElements.get('fb-secondary-sidebar')) customElements.define('fb-secondary-sidebar', FbSecondarySidebar);

