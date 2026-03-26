import { LitElement, css, html } from 'lit';
import { SidebarBase } from './sidebar-base';

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

if (!customElements.get('spotify-secondary-sidebar')) customElements.define('spotify-secondary-sidebar', SpotifySecondarySidebar);

