import { LitElement, css, html } from 'lit';

/* ──────────────────────────────────────────────────────────────
   Base class with collapsible sections – clean Apple-inspired base
────────────────────────────────────────────────────────────── */
abstract class SidebarBase extends LitElement {
  static override styles = [
    css`
      :host {
        display: flex;
        flex-direction: column;
        width: var(--sidebar-w, 260px);
        height: 100%;
        background: var(--sidebar-bg, #000000);
        border-right: 1px solid var(--sidebar-bd, rgba(255, 255, 255, 0.08));
        overflow: hidden;
        flex-shrink: 0;
        font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'SF Pro Display', 'Inter', system-ui, sans-serif;
      }

      .scroller {
        flex: 1;
        overflow-y: auto;
        overflow-x: hidden;
        padding: 20px 12px 24px;
        scrollbar-width: none;
        -ms-overflow-style: none;
      }
      .scroller::-webkit-scrollbar {
        display: none;
      }

      /* Section header with chevron */
      .section-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 12px 12px 8px;
        cursor: pointer;
        user-select: none;
        transition: all 0.2s cubic-bezier(0.2, 0.9, 0.4, 1.1);
        border-radius: 8px;
        margin: 4px 0;
      }
      .section-header:hover {
        background: rgba(255, 255, 255, 0.03);
      }
      .section-label {
        font-size: 12px;
        font-weight: 600;
        letter-spacing: 0.5px;
        text-transform: uppercase;
        color: #8e8e93;
      }
      .chevron {
        width: 16px;
        height: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: transform 0.25s cubic-bezier(0.2, 0.9, 0.4, 1.1);
        color: #8e8e93;
      }
      .chevron.collapsed {
        transform: rotate(-90deg);
      }
      .section-content {
        overflow: hidden;
        transition: max-height 0.25s cubic-bezier(0.2, 0.9, 0.4, 1.1);
        max-height: 1000px;
      }
      .section-content.collapsed {
        max-height: 0;
      }

      /* Navigation items – Apple style */
      .item {
        display: flex;
        align-items: center;
        gap: 14px;
        width: 100%;
        padding: 9px 12px;
        margin: 3px 0;
        border-radius: 10px;
        border: none;
        background: transparent;
        color: #e5e5ea;
        font-size: 14px;
        font-weight: 450;
        font-family: inherit;
        text-align: left;
        cursor: pointer;
        transition: all 0.2s cubic-bezier(0.2, 0, 0, 1);
        position: relative;
      }
      .item svg {
        flex-shrink: 0;
        width: 20px;
        height: 20px;
        opacity: 0.75;
        transition: opacity 0.2s, transform 0.2s;
      }
      .item:hover {
        background: rgba(255, 255, 255, 0.05);
        color: #ffffff;
      }
      .item:hover svg {
        opacity: 1;
        transform: scale(1.04);
      }
      .item.active {
        background: rgba(255, 255, 255, 0.08);
        color: #ffffff;
        font-weight: 500;
      }
      .item.active::before {
        content: '';
        position: absolute;
        left: -8px;
        top: 50%;
        transform: translateY(-50%);
        width: 3px;
        height: 24px;
        background: #ff3b30;
        border-radius: 3px;
      }
      .item.active svg {
        opacity: 1;
      }

      /* Apple-style circular notification badge */
      .notification-badge {
        margin-left: auto;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 16px;
        height: 16px;
        background: #ff3b30;
        color: #ffffff;
        font-size: 10px;
        font-weight: 600;
        font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', system-ui;
        border-radius: 50%;
        line-height: 1;
        letter-spacing: -0.2px;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        flex-shrink: 0;
      }

      /* For numbers larger than 9, adjust slightly */
      .notification-badge.large {
        width: auto;
        min-width: 16px;
        padding: 0 4px;
        border-radius: 10px;
      }

      /* Dot indicator for subtle notifications */
      .dot-indicator {
        margin-left: auto;
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: #ff3b30;
        box-shadow: 0 0 0 1px rgba(255, 59, 48, 0.2);
      }

      /* Channel avatar */
      .ch-av {
        width: 28px;
        height: 28px;
        border-radius: 50%;
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 11px;
        font-weight: 600;
        color: #fff;
        transition: transform 0.2s;
      }
      .item:hover .ch-av {
        transform: scale(1.02);
      }

      /* Active state animation */
      @keyframes subtleSlide {
        from {
          opacity: 0;
          transform: translateX(-4px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }
      .item.active {
        animation: subtleSlide 0.2s ease;
      }
    `
  ];

  static override properties = {
    _collapsedSections: { type: Object, state: true }
  };

  protected _collapsedSections: Record<string, boolean> = {};

  protected _toggleSection(section: string) {
    this._collapsedSections = {
      ...this._collapsedSections,
      [section]: !this._collapsedSections[section]
    };
    this.requestUpdate();
  }

  protected _nav(path: string) {
    this.dispatchEvent(new CustomEvent('navigate', { detail: path, bubbles: true, composed: true }));
  }

  protected _active(path: string) {
    return location.pathname === path || (path !== '/' && location.pathname.startsWith(path));
  }
}

/* ──────────────────────────────────────────────────────────────
   YouTube sidebar – refined Apple UI
────────────────────────────────────────────────────────────── */
class YtSecondarySidebar extends SidebarBase {
  static override styles = [
    ...super.styles,
    css`
      /* Subtle refinements for a premium feel */
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
        background: #ff3b30;
        border-radius: 4px;
      }
      .ch-av {
        width: 30px;
        height: 30px;
        font-size: 12px;
        font-weight: 600;
      }
      /* Remove extra spacing on first child of section content */
      .section-content .item:first-of-type {
        margin-top: 4px;
      }
    `
  ];

  override render() {
    const a = this._active.bind(this);
    return html`
      <div class="scroller">
        <!-- Menu section -->
        <div class="section-header" @click=${() => this._toggleSection('menu')}>
          <span class="section-label">Menu</span>
          <div class="chevron ${this._collapsedSections.menu ? 'collapsed' : ''}">
            <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M7 10l5 5 5-5z"/></svg>
          </div>
        </div>
        <div class="section-content ${this._collapsedSections.menu ? 'collapsed' : ''}">
          <button class="item ${a('/') || a('/videos') ? 'active' : ''}" @click=${() => this._nav('/')}>
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg> Home
          </button>
          <button class="item" @click=${() => this._nav('/videos')}>
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 8H4V6h16v2zm-2-6H6v2h12V2zm4 10v8c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2v-8c0-1.1.9-2 2-2h16c1.1 0 2 .9 2 2zm-6 4l-6-3.27v6.53L16 16z"/></svg>
            Subscriptions
            <span class="notification-badge">3</span>
          </button>
        </div>

        <!-- You section -->
        <div class="section-header" @click=${() => this._toggleSection('you')}>
          <span class="section-label">You</span>
          <div class="chevron ${this._collapsedSections.you ? 'collapsed' : ''}">
            <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M7 10l5 5 5-5z"/></svg>
          </div>
        </div>
        <div class="section-content ${this._collapsedSections.you ? 'collapsed' : ''}">
          <button class="item"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg> Library</button>
          <button class="item"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/></svg> History</button>
          <button class="item"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z"/></svg> Watch Later</button>
          <button class="item"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"/></svg> Liked Videos</button>
        </div>

        <!-- Explore section -->
        <div class="section-header" @click=${() => this._toggleSection('explore')}>
          <span class="section-label">Explore</span>
          <div class="chevron ${this._collapsedSections.explore ? 'collapsed' : ''}">
            <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M7 10l5 5 5-5z"/></svg>
          </div>
        </div>
        <div class="section-content ${this._collapsedSections.explore ? 'collapsed' : ''}">
          <button class="item"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.53 11.2c-.23-.3-.5-.56-.76-.82-.65-.6-1.4-1.03-2.03-1.66-1.46-1.46-1.78-3.87-.85-5.72-.9.23-1.75.75-2.45 1.32C9.18 6.4 7.84 9.19 7.93 12c.02.48-.04.96-.22 1.4-.2.47-.52.88-.93 1.18-.07.05-.14.09-.2.14-.03-.5-.06-1-.01-1.5.06-.6.2-1.16.49-1.67a5.37 5.37 0 0 0-.78 2.61c-.04.3-.02.62-.01.92.01.29.04.58.09.87.08.57.23 1.13.47 1.66A6.92 6.92 0 0 0 12 22c3.87 0 7-3.13 7-7 .01-1.35-.38-2.62-1.47-3.8z"/></svg> Trending</button>
          <button class="item"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg> Music</button>
          <button class="item"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M21 6H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-10 7H8v3H6v-3H3v-2h3V8h2v3h3v2zm4.5 2c-.83 0-1.5-.67-1.5-1.5S14.67 12 15.5 12s1.5.67 1.5 1.5S16.33 15 15.5 15zm3-3c-.83 0-1.5-.67-1.5-1.5S17.67 9 18.5 9s1.5.67 1.5 1.5S19.33 12 18.5 12z"/></svg> Gaming</button>
          <button class="item"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/></svg> Live</button>
        </div>

        <!-- Subscriptions section -->
        <div class="section-header" @click=${() => this._toggleSection('subscriptions')}>
          <span class="section-label">Subscriptions</span>
          <div class="chevron ${this._collapsedSections.subscriptions ? 'collapsed' : ''}">
            <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M7 10l5 5 5-5z"/></svg>
          </div>
        </div>
        <div class="section-content ${this._collapsedSections.subscriptions ? 'collapsed' : ''}">
          ${[
            { name:'Fireship', color:'#4285F4', init:'F' },
            { name:'Marques Brownlee', color:'#EA4335', init:'MB' },
            { name:'Kurzgesagt', color:'#7C4DFF', init:'K' },
            { name:'Veritasium', color:'#34A853', init:'V' },
            { name:'NASA', color:'#0353a4', init:'N' },
            { name:'Linus Tech Tips', color:'#3d405b', init:'LT' }
          ].map((ch, i) => html`
            <button class="item" @click=${() => this._nav('/channel/c' + (i + 1))}>
              <span class="ch-av" style="background:${ch.color}">${ch.init}</span>
              <span style="flex:1; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${ch.name}</span>
            </button>
          `)}
        </div>
      </div>
    `;
  }
}


/* ──────────────────────────────────────────────────────────────
   2. Social Media Sidebar – refined Apple UI
────────────────────────────────────────────────────────────── */
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

/* ──────────────────────────────────────────────────────────────
   3. Discord sidebar (custom colors)
────────────────────────────────────────────────────────────── */
class DiscordSecondarySidebar extends SidebarBase {
  static override styles = [
    super.styles,
    css`
      :host { background: #2b2d31; border-right-color: rgba(255,255,255,0.05); }
      .item { color: #949ba4; }
      .item:hover { background: rgba(255,255,255,0.06); color: #dbdee1; }
      .item.active { background: rgba(88,101,242,0.18); color: #fff; }
      .section-label { color: #6d6f78; }
      .server-av {
        width: 28px; height: 28px; border-radius: 50%; flex-shrink: 0;
        display: flex; align-items: center; justify-content: center;
        font-size: 11px; font-weight: 700; color: #fff;
      }
      .status { width: 8px; height: 8px; border-radius: 50%; margin-left: auto; flex-shrink: 0; }
    `
  ];

  override render() {
    const servers = [
      { n: 'Gaming Hub', c: '#5865f2', i: 'GH' },
      { n: 'Dev Corner',  c: '#23a559', i: 'DC' },
      { n: 'Anime Club',  c: '#f23f42', i: 'AC' },
      { n: 'Music Room',  c: '#e9a116', i: 'MR' },
    ];
    const channels = ['general','announcements','random','dev-talk','showcase'];
    return html`
      <div class="scroller">
        <!-- Direct Messages section -->
        <div class="section-header" @click=${() => this._toggleSection('dm')}>
          <span class="section-label">Direct Messages</span>
          <div class="chevron ${this._collapsedSections.dm ? 'collapsed' : ''}">
            <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M7 10l5 5 5-5z"/></svg>
          </div>
        </div>
        <div class="section-content ${this._collapsedSections.dm ? 'collapsed' : ''}">
          <button class="item active" @click=${() => this._nav('/chat')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>
            friends
          </button>
          <button class="item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/></svg>
            nitro
          </button>
        </div>

        <!-- Servers section -->
        <div class="section-header" @click=${() => this._toggleSection('servers')}>
          <span class="section-label">Servers</span>
          <div class="chevron ${this._collapsedSections.servers ? 'collapsed' : ''}">
            <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M7 10l5 5 5-5z"/></svg>
          </div>
        </div>
        <div class="section-content ${this._collapsedSections.servers ? 'collapsed' : ''}">
          ${servers.map((s, i) => html`
            <button class="item ${i === 0 ? 'active' : ''}">
              <div class="server-av" style="background:${s.c}">${s.i}</div>
              ${s.n}
              ${i === 0 ? html`<span class="status" style="background:#23a559"></span>` : ''}
            </button>`)}
        </div>

        <!-- Text Channels section -->
        <div class="section-header" @click=${() => this._toggleSection('text')}>
          <span class="section-label">Text Channels</span>
          <div class="chevron ${this._collapsedSections.text ? 'collapsed' : ''}">
            <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M7 10l5 5 5-5z"/></svg>
          </div>
        </div>
        <div class="section-content ${this._collapsedSections.text ? 'collapsed' : ''}">
          ${channels.map((ch, i) => html`
            <button class="item ${i === 0 ? 'active' : ''}">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M10.17 5l-.85 4h4.15l.85-4H16l-.85 4H18v2h-3.17l-.85 4H16v2h-2.5l-.84 4h-1.83l.84-4H7.34l-.84 4H4.67l.84-4H3v-2h2.84l.85-4H5V9h1.99l.86-4h1.82z"/></svg>
              ${ch}
            </button>`)}
        </div>

        <!-- Voice section -->
        <div class="section-header" @click=${() => this._toggleSection('voice')}>
          <span class="section-label">Voice</span>
          <div class="chevron ${this._collapsedSections.voice ? 'collapsed' : ''}">
            <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M7 10l5 5 5-5z"/></svg>
          </div>
        </div>
        <div class="section-content ${this._collapsedSections.voice ? 'collapsed' : ''}">
          ${['Gaming','Study Room','Music'].map(ch => html`
            <button class="item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/></svg>
              ${ch}
            </button>`)}
        </div>
      </div>
    `;
  }
}

/* ──────────────────────────────────────────────────────────────
   4. Spotify sidebar (custom styles)
────────────────────────────────────────────────────────────── */
class SpotifySecondarySidebar extends SidebarBase {
  static override styles = [
    super.styles,
    css`
      :host { background: #121212; border-right-color: rgba(255,255,255,0.08); }
      .item { color: #a7a7a7; }
      .item:hover { background: rgba(255,255,255,0.07); color: #fff; }
      .item.active { background: rgba(29,185,84,0.12); color: #fff; }
      .section-label { color: #6a6a6a; }
      .pl-art { width: 34px; height: 34px; border-radius: 5px; flex-shrink: 0; display:flex;align-items:center;justify-content:center;font-size:16px; }
      .pl-text { display:flex;flex-direction:column;min-width:0; }
      .pl-name { font-size:13px;font-weight:500;color:inherit;white-space:nowrap;overflow:hidden;text-overflow:ellipsis; }
      .pl-sub  { font-size:11px;color:#6a6a6a;margin-top:1px; }
    `
  ];

  override render() {
    const playlists = [
      { n:'Chill Vibes', s:'32 songs', c:'#1db954', e:'🌊' },
      { n:'Late Night Drive', s:'18 songs', c:'#e91e63', e:'🌙' },
      { n:'Workout Mix', s:'45 songs', c:'#ff5722', e:'💪' },
      { n:'Focus Mode', s:'27 songs', c:'#9c27b0', e:'🎯' },
      { n:'Throwbacks', s:'61 songs', c:'#ff9800', e:'📻' },
    ];
    return html`
      <div class="scroller">
        <!-- Navigate section -->
        <div class="section-header" @click=${() => this._toggleSection('navigate')}>
          <span class="section-label">Navigate</span>
          <div class="chevron ${this._collapsedSections.navigate ? 'collapsed' : ''}">
            <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M7 10l5 5 5-5z"/></svg>
          </div>
        </div>
        <div class="section-content ${this._collapsedSections.navigate ? 'collapsed' : ''}">
          <button class="item active" @click=${() => this._nav('/music')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg> Home
          </button>
          <button class="item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg> Search
          </button>
        </div>

        <!-- Your Library section -->
        <div class="section-header" @click=${() => this._toggleSection('library')}>
          <span class="section-label">Your Library</span>
          <div class="chevron ${this._collapsedSections.library ? 'collapsed' : ''}">
            <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M7 10l5 5 5-5z"/></svg>
          </div>
        </div>
        <div class="section-content ${this._collapsedSections.library ? 'collapsed' : ''}">
          <button class="item"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg> Playlists</button>
          <button class="item"><svg width="18" height="18" viewBox="0 0 24 24" fill="#1db954"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg> Liked Songs</button>
          <button class="item"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg> Albums</button>
          <button class="item"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg> Artists</button>
        </div>

        <!-- Playlists section -->
        <div class="section-header" @click=${() => this._toggleSection('playlists')}>
          <span class="section-label">Playlists</span>
          <div class="chevron ${this._collapsedSections.playlists ? 'collapsed' : ''}">
            <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M7 10l5 5 5-5z"/></svg>
          </div>
        </div>
        <div class="section-content ${this._collapsedSections.playlists ? 'collapsed' : ''}">
          ${playlists.map(p => html`
            <button class="item" style="gap:10px">
              <div class="pl-art" style="background:${p.c}22">${p.e}</div>
              <div class="pl-text">
                <span class="pl-name">${p.n}</span>
                <span class="pl-sub">Playlist · ${p.s}</span>
              </div>
            </button>`)}
        </div>
      </div>
    `;
  }
}

/* ──────────────────────────────────────────────────────────────
   5. Netflix sidebar
────────────────────────────────────────────────────────────── */
class NetflixSecondarySidebar extends SidebarBase {
  static override styles = [
    super.styles,
    css`
      :host { background: #141414; border-right-color: rgba(255,255,255,0.08); }
      .item { color: #aaa; }
      .item:hover { background: rgba(255,255,255,0.07); color: #fff; }
      .item.active { background: rgba(229,9,20,0.12); color: #fff; }
      .section-label { color: #555; }
      .genre { display:block; padding:5px 10px; border-radius:7px; border:none; background:none; cursor:pointer; color:#777; font-size:12px; font-family:inherit; text-align:left; width:100%; transition:color 100ms; }
      .genre:hover { color:#ccc; }
    `
  ];

  override render() {
    const a = this._active.bind(this);
    return html`
      <div class="scroller">
        <!-- Browse section -->
        <div class="section-header" @click=${() => this._toggleSection('browse')}>
          <span class="section-label">Browse</span>
          <div class="chevron ${this._collapsedSections.browse ? 'collapsed' : ''}">
            <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M7 10l5 5 5-5z"/></svg>
          </div>
        </div>
        <div class="section-content ${this._collapsedSections.browse ? 'collapsed' : ''}">
          <button class="item ${a('/streaming') ? 'active' : ''}" @click=${() => this._nav('/streaming')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg> Home
          </button>
          <button class="item"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18 3v2h-2V3H8v2H6V3H4v18h2v-2h2v2h8v-2h2v2h2V3h-2z"/></svg> Movies</button>
          <button class="item"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M21 3H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h5v2h8v-2h5c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 14H3V5h18v12z"/></svg> TV Shows</button>
          <button class="item"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z"/></svg> My List</button>
          <button class="item"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.53 11.2c-.23-.3-.5-.56-.76-.82-.65-.6-1.4-1.03-2.03-1.66-1.46-1.46-1.78-3.87-.85-5.72-.9.23-1.75.75-2.45 1.32C9.18 6.4 7.84 9.19 7.93 12c.02.48-.04.96-.22 1.4-.2.47-.52.88-.93 1.18-.07.05-.14.09-.2.14-.03-.5-.06-1-.01-1.5.06-.6.2-1.16.49-1.67a5.37 5.37 0 0 0-.78 2.61c-.04.3-.02.62-.01.92.01.29.04.58.09.87.08.57.23 1.13.47 1.66A6.92 6.92 0 0 0 12 22c3.87 0 7-3.13 7-7 .01-1.35-.38-2.62-1.47-3.8z"/></svg> New & Popular</button>
        </div>

        <!-- Genres section -->
        <div class="section-header" @click=${() => this._toggleSection('genres')}>
          <span class="section-label">Genres</span>
          <div class="chevron ${this._collapsedSections.genres ? 'collapsed' : ''}">
            <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M7 10l5 5 5-5z"/></svg>
          </div>
        </div>
        <div class="section-content ${this._collapsedSections.genres ? 'collapsed' : ''}">
          ${['Action','Comedy','Drama','Sci-Fi','Horror','Documentary','Romance','Animation','Thriller'].map(g => html`
            <button class="genre">${g}</button>`)}
        </div>
      </div>
    `;
  }
}

/* ──────────────────────────────────────────────────────────────
   6. Professional (LinkedIn) sidebar
────────────────────────────────────────────────────────────── */
class ProfessionalSecondarySidebar extends SidebarBase {
  static override styles = [super.styles];

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

/* ──────────────────────────────────────────────────────────────
   7. AI sidebar
────────────────────────────────────────────────────────────── */
class AISecondarySidebar extends SidebarBase {
  static override styles = [super.styles];

  override render() {
    const conversations = ['Debug my React app','Write unit tests','Explain transformers','SQL optimization','UI component ideas'];
    return html`
      <div class="scroller">
        <!-- AI Studio section -->
        <div class="section-header" @click=${() => this._toggleSection('aistudio')}>
          <span class="section-label">AI Studio</span>
          <div class="chevron ${this._collapsedSections.aistudio ? 'collapsed' : ''}">
            <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M7 10l5 5 5-5z"/></svg>
          </div>
        </div>
        <div class="section-content ${this._collapsedSections.aistudio ? 'collapsed' : ''}">
          <button class="item active" @click=${() => this._nav('/ai')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg> New Chat
          </button>
          <button class="item"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg> Templates</button>
          <button class="item"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z"/></svg> Saved</button>
        </div>

        <!-- Recent Chats section -->
        <div class="section-header" @click=${() => this._toggleSection('recent')}>
          <span class="section-label">Recent Chats</span>
          <div class="chevron ${this._collapsedSections.recent ? 'collapsed' : ''}">
            <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M7 10l5 5 5-5z"/></svg>
          </div>
        </div>
        <div class="section-content ${this._collapsedSections.recent ? 'collapsed' : ''}">
          ${conversations.map((c, i) => html`
            <button class="item ${i === 0 ? 'active' : ''}">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>
              <span style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0">${c}</span>
            </button>`)}
        </div>

        <!-- Models section -->
        <div class="section-header" @click=${() => this._toggleSection('models')}>
          <span class="section-label">Models</span>
          <div class="chevron ${this._collapsedSections.models ? 'collapsed' : ''}">
            <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M7 10l5 5 5-5z"/></svg>
          </div>
        </div>
        <div class="section-content ${this._collapsedSections.models ? 'collapsed' : ''}">
          ${['Claude Sonnet','GPT-4o','Gemini Pro','Llama 3'].map(m => html`
            <button class="item"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 1 1 0 20A10 10 0 0 1 12 2z"/></svg> ${m}</button>`)}
        </div>
      </div>
    `;
  }
}

/* ──────────────────────────────────────────────────────────────
   8. Learning sidebar
────────────────────────────────────────────────────────────── */
class LearningSecondarySidebar extends SidebarBase {
  static override styles = [super.styles];

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

/* ──────────────────────────────────────────────────────────────
   9. Shopping sidebar
────────────────────────────────────────────────────────────── */
class ShoppingSecondarySidebar extends SidebarBase {
  static override styles = [super.styles];

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

/* ──────────────────────────────────────────────────────────────
   10. Marketplace sidebar
────────────────────────────────────────────────────────────── */
class MarketplaceSecondarySidebar extends SidebarBase {
  static override styles = [super.styles];

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

/* ──────────────────────────────────────────────────────────────
   11. Maps sidebar
────────────────────────────────────────────────────────────── */
class MapsSecondarySidebar extends SidebarBase {
  static override styles = [super.styles];

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

/* ──────────────────────────────────────────────────────────────
   12. Transport sidebar
────────────────────────────────────────────────────────────── */
class TransportSecondarySidebar extends SidebarBase {
  static override styles = [super.styles];

  override render() {
    return html`
      <div class="scroller">
        <!-- Transport section -->
        <div class="section-header" @click=${() => this._toggleSection('transport')}>
          <span class="section-label">Transport</span>
          <div class="chevron ${this._collapsedSections.transport ? 'collapsed' : ''}">
            <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M7 10l5 5 5-5z"/></svg>
          </div>
        </div>
        <div class="section-content ${this._collapsedSections.transport ? 'collapsed' : ''}">
          <button class="item active" @click=${() => this._nav('/transport')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg> Home
          </button>
          <button class="item"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99z"/></svg> Ride Now</button>
          <button class="item"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z"/></svg> Schedule</button>
          <button class="item"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/></svg> Trip History</button>
        </div>

        <!-- Vehicle Types section -->
        <div class="section-header" @click=${() => this._toggleSection('vehicles')}>
          <span class="section-label">Vehicle Types</span>
          <div class="chevron ${this._collapsedSections.vehicles ? 'collapsed' : ''}">
            <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M7 10l5 5 5-5z"/></svg>
          </div>
        </div>
        <div class="section-content ${this._collapsedSections.vehicles ? 'collapsed' : ''}">
          ${['Standard','Comfort','XL','Premium','Moto','Cargo'].map(v => html`
            <button class="item" style="padding:6px 10px">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99z"/></svg> ${v}</button>`)}
        </div>

        <!-- Payment section -->
        <div class="section-header" @click=${() => this._toggleSection('payment')}>
          <span class="section-label">Payment</span>
          <div class="chevron ${this._collapsedSections.payment ? 'collapsed' : ''}">
            <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M7 10l5 5 5-5z"/></svg>
          </div>
        </div>
        <div class="section-content ${this._collapsedSections.payment ? 'collapsed' : ''}">
          <button class="item"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/></svg> Payment Methods</button>
          <button class="item"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/></svg> Promotions</button>
        </div>
      </div>
    `;
  }
}

/* ──────────────────────────────────────────────────────────────
   13. Auth sidebar
────────────────────────────────────────────────────────────── */
class AuthSecondarySidebar extends SidebarBase {
  static override styles = [super.styles];

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

/* ──────────────────────────────────────────────────────────────
   Register all components
────────────────────────────────────────────────────────────── */
const DEFS: [string, CustomElementConstructor][] = [
  ['yt-secondary-sidebar',            YtSecondarySidebar],
  ['fb-secondary-sidebar',            FbSecondarySidebar],
  ['discord-secondary-sidebar',       DiscordSecondarySidebar],
  ['spotify-secondary-sidebar',       SpotifySecondarySidebar],
  ['netflix-secondary-sidebar',       NetflixSecondarySidebar],
  ['professional-secondary-sidebar',  ProfessionalSecondarySidebar],
  ['ai-secondary-sidebar',            AISecondarySidebar],
  ['learning-secondary-sidebar',      LearningSecondarySidebar],
  ['shopping-secondary-sidebar',      ShoppingSecondarySidebar],
  ['marketplace-secondary-sidebar',   MarketplaceSecondarySidebar],
  ['maps-secondary-sidebar',          MapsSecondarySidebar],
  ['transport-secondary-sidebar',     TransportSecondarySidebar],
  ['auth-secondary-sidebar',          AuthSecondarySidebar],
];
DEFS.forEach(([tag, cls]) => {
  if (!customElements.get(tag)) customElements.define(tag, cls);
});