import { LitElement, css, html } from 'lit';
import { SidebarBase } from './sidebar-base';

class YtSecondarySidebar extends SidebarBase {
  static override styles = (super.styles as any).concat(css`
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
    `);
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

if (!customElements.get('yt-secondary-sidebar')) customElements.define('yt-secondary-sidebar', YtSecondarySidebar);
