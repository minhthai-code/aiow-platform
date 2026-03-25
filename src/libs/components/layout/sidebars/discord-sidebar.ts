import { LitElement, css, html } from 'lit';
import { SidebarBase } from './sidebar-base';

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

if (!customElements.get('discord-secondary-sidebar')) customElements.define('discord-secondary-sidebar', DiscordSecondarySidebar);

