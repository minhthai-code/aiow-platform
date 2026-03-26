import { LitElement, css, html } from 'lit';
import { SidebarBase } from './sidebar-base';

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

if (!customElements.get('netflix-secondary-sidebar')) customElements.define('netflix-secondary-sidebar', NetflixSecondarySidebar);

