import { LitElement, html, css } from 'lit';
import '@libs/components/controls/yt-music-player';

const SUB_CHANNELS = [
  { name:'Fireship',         color:'#4285F4', init:'F'  },
  { name:'Marques Brownlee', color:'#EA4335', init:'MB' },
  { name:'Kurzgesagt',       color:'#7C4DFF', init:'K'  },
  { name:'Veritasium',       color:'#34A853', init:'V'  },
  { name:'NASA',             color:'#0353a4', init:'N'  },
  { name:'Linus Tech Tips',  color:'#3d405b', init:'LT' },
  { name:'The Verge',        color:'#c1121f', init:'TV' },
  { name:'SpaceX',           color:'#48cae4', init:'SX' },
  { name:'TechLinked',       color:'#0f3460', init:'TL' },
  { name:'Google',           color:'#4285F4', init:'G'  },
  { name:'CGP Grey',         color:'#6a4c93', init:'CG' },
  { name:'3Blue1Brown',      color:'#1b4332', init:'3B' },
];

export class YtSidebar extends LitElement {
  static override properties = {
    _active:       { type: String,  state: true },
    _musicVisible: { type: Boolean, state: true },
  };

  static override styles = css`
    :host {
      display: flex;
      flex-direction: column;
      height: 100%;
      width: var(--sidebar-w, 224px);
      background: var(--sidebar-bg, #0d0d0d);
      /* Same token as rail — both sidebars always match */
      border-right: 1px solid var(--sidebar-bd, rgba(255,255,255,0.09));
      overflow: hidden;
      flex-shrink: 0;
    }

    /* ── Scrollable nav ── */
    .nav-scroll {
      flex: 1;
      overflow-y: auto;
      overflow-x: hidden;
      padding: 6px 0 6px;
      min-height: 0;

      /* Hide scrollbar everywhere */
      scrollbar-width: none;        /* Firefox */
      -ms-overflow-style: none;     /* IE/Edge */
    }

    .nav-scroll::-webkit-scrollbar {
      display: none;                /* Chrome/Safari */
    }
    .nav-scroll::-webkit-scrollbar-track {
      background: transparent;
    }
    .nav-scroll::-webkit-scrollbar-thumb {
      background: transparent;  /* hidden by default */
      border-radius: 2px;
      transition: background 200ms ease;
    }
    /* Show scrollbar ONLY when hovering the sidebar */
    // :host(:hover) .nav-scroll::-webkit-scrollbar-thumb {
    //   background: var(--scrollbar-thumb, rgba(255,255,255,0.15));
    // }
    // :host(:hover) .nav-scroll {
    //   scrollbar-width: thin;
    //   scrollbar-color: var(--scrollbar-thumb, rgba(255,255,255,0.15)) transparent;
    // }

    /* Section label */
    .section-title {
      padding: 14px 18px 4px;
      font-size: 10px; font-weight: 700;
      letter-spacing: 1px; text-transform: uppercase;
      color: var(--tx-3, #444444);
      white-space: nowrap; user-select: none;
    }

    /* Nav item */
    .item {
      display: flex; align-items: center; gap: 12px;
      height: 36px; padding: 0 12px;
      margin: 1px 8px;
      border-radius: var(--r-md, 12px);
      cursor: pointer; border: none;
      background: none;
      color: var(--tx-2, #888888);
      font-size: 13px; font-weight: 500; font-family: var(--font, inherit);
      width: calc(100% - 16px); text-align: left;
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
      transition: background 100ms ease, color 100ms ease;
    }
    .item:hover  { background: var(--bg-hover); color: var(--tx-1); }
    .item.active { background: var(--bg-active); color: var(--tx-1); }

    .item svg { flex-shrink: 0; width: 18px; height: 18px; opacity: 0.6; transition: opacity 100ms ease; }
    .item:hover svg, .item.active svg { opacity: 1; }

    /* Active dot */
    .dot {
      width: 5px; height: 5px; border-radius: 50%;
      background: var(--brand); margin-left: auto; flex-shrink: 0;
    }

    /* Channel avatar */
    .ch-av {
      width: 22px; height: 22px; border-radius: 50%; flex-shrink: 0;
      display: flex; align-items: center; justify-content: center;
      font-size: 9px; font-weight: 700; color: #fff;
    }

    .gap { height: 6px; }

    /* Fixed player dock */
    .player-dock { flex-shrink: 0; }
  `;

  private _active = '/';
  private _musicVisible = true;

  override connectedCallback(): void {
    super.connectedCallback();
    this._active = location.pathname;
    window.addEventListener('popstate', () => { this._active = location.pathname; this.requestUpdate(); });
  }

  private _nav(path: string): void {
    this._active = path;
    this.requestUpdate();
    this.dispatchEvent(new CustomEvent('navigate', { detail: path, bubbles: true, composed: true }));
  }

  private _i(icon: string, label: string, path: string) {
    const active = this._active === path;
    return html`
      <button class="item ${active ? 'active' : ''}" @click=${() => this._nav(path)}>
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="${icon}"/></svg>
        ${label}
        ${active ? html`<span class="dot"></span>` : ''}
      </button>`;
  }

  override render() {
    return html`
      <div class="nav-scroll">
        ${this._i('M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z', 'Home', '/')}
        ${this._i('M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z', 'Shorts', '/shorts')}
        ${this._i('M20 8H4V6h16v2zm-2-6H6v2h12V2zm4 10v8c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2v-8c0-1.1.9-2 2-2h16c1.1 0 2 .9 2 2zm-6 4l-6-3.27v6.53L16 16z', 'Subscriptions', '/subscriptions')}

        <div class="gap"></div>
        <div class="section-title">You</div>
        ${this._i('M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z', 'Your channel', '/channel/me')}
        ${this._i('M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z', 'History', '/history')}
        ${this._i('M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z', 'Liked videos', '/liked')}
        ${this._i('M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z', 'Watch later', '/watchlater')}

        <div class="gap"></div>
        <div class="section-title">Explore</div>
        ${this._i('M17.53 11.2c-.23-.3-.5-.56-.76-.82-.65-.6-1.4-1.03-2.03-1.66-1.46-1.46-1.78-3.87-.85-5.72-.9.23-1.75.75-2.45 1.32C9.18 6.4 7.84 9.19 7.93 12c.02.48-.04.96-.22 1.4-.2.47-.52.88-.93 1.18-.07.05-.14.09-.2.14-.03-.5-.06-1-.01-1.5.06-.6.2-1.16.49-1.67a5.37 5.37 0 0 0-.78 2.61c-.04.3-.02.62-.01.92.01.29.04.58.09.87.08.57.23 1.13.47 1.66A6.92 6.92 0 0 0 12 22c3.87 0 7-3.13 7-7 .01-1.35-.38-2.62-1.47-3.8z', 'Trending', '/trending')}
        ${this._i('M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z', 'Music', '/music')}
        ${this._i('M21 6H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-10 7H8v3H6v-3H3v-2h3V8h2v3h3v2zm4.5 2c-.83 0-1.5-.67-1.5-1.5S14.67 12 15.5 12s1.5.67 1.5 1.5S16.33 15 15.5 15zm3-3c-.83 0-1.5-.67-1.5-1.5S17.67 9 18.5 9s1.5.67 1.5 1.5S19.33 12 18.5 12z', 'Gaming', '/gaming')}
        ${this._i('M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z', 'Live', '/live')}

        <div class="gap"></div>
        <div class="section-title">Subscriptions</div>

        ${SUB_CHANNELS.map((ch, i) => html`
          <button class="item" @click=${() => this._nav('/channel/c' + (i + 1))}>
            <span class="ch-av" style="background:${ch.color}">${ch.init}</span>
            ${ch.name}
          </button>`)}

        <div class="gap"></div>
      </div>

      ${this._musicVisible ? html`
        <div class="player-dock">
          <yt-music-player
            @close=${() => { this._musicVisible = false; this.requestUpdate(); }}
          ></yt-music-player>
        </div>` : ''}
    `;
  }
}

if (!customElements.get('yt-sidebar')) customElements.define('yt-sidebar', YtSidebar);
