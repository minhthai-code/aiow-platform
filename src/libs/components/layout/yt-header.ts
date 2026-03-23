import { LitElement, html, css } from 'lit';
import { getRegisteredService } from '@core/runtime-api/platform-element';
import type { NavigationController } from '@core/router/router';
import { toggleTheme, getTheme } from '@libs/tokens/tokens';
import { on } from '@core/runtime-api/event-bus';
import { resolvePlatformForPath, PLATFORM_META, type PlatformSidebarId } from '@platform/runtime/platform-sidebar-controller';

export class YtHeader extends LitElement {
  static override properties = {
    _theme:    { type: String,  state: true },
    _lang:     { type: String,  state: true },
    _userOpen: { type: Boolean, state: true },
    _platform: { type: String,  state: true },
  };

  static override styles = css`
  :host { 
    display: block; 
    flex-shrink: 0; 
    z-index: var(--z-header, 200);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  }

  header {
    height: var(--header-h, 60px);
    background: color-mix(in srgb, var(--header-bg) 70%, transparent);
    backdrop-filter: blur(20px) saturate(180%);
    -webkit-backdrop-filter: blur(20px) saturate(180%);
    border-bottom: 1px solid var(--header-border);
    display: flex; 
    align-items: center;
    padding: 0 20px 0 12px;
    gap: 0;
  }

  /* LEFT: fixed width matches right section */
  .left {
    display: flex; 
    align-items: center; 
    gap: 4px;
    flex: 0 0 auto; 
    width: 300px; /* Match right section width */
  }
  
  .menu-btn {
    width: 36px; 
    height: 36px; 
    border-radius: 18px;
    border: none; 
    background: transparent; 
    cursor: pointer;
    display: flex; 
    align-items: center; 
    justify-content: center;
    color: var(--icon-tx); 
    flex-shrink: 0;
    transition: all 0.2s cubic-bezier(0.25, 0.1, 0.25, 1);
  }
  .menu-btn:hover { 
    background: color-mix(in srgb, var(--tx-1) 8%, transparent);
    color: var(--tx-1);
  }
  .menu-btn:active { 
    background: color-mix(in srgb, var(--tx-1) 12%, transparent);
    transform: scale(0.96); 
  }

  .logo {
    display: flex; 
    align-items: center; 
    gap: 6px;
    text-decoration: none; 
    padding: 6px 12px; 
    border-radius: 18px;
    transition: background 0.2s ease;
  }
  .logo:hover { 
    background: color-mix(in srgb, var(--tx-1) 6%, transparent);
  }
  
  .logo-mark {
    width: 24px; 
    height: 24px; 
    border-radius: 12px;
    background: var(--brand);
    display: flex; 
    align-items: center; 
    justify-content: center;
  }
  
  .logo-text { 
    font-size: 16px; 
    font-weight: 600; 
    color: var(--tx-1); 
    letter-spacing: -0.3px; 
  }

  /* CENTER: search — truly centred between equal-width sections */
  .center { 
    flex: 1; 
    display: flex; 
    align-items: center; 
    justify-content: center; 
    min-width: 0; /* Allow center to shrink if needed */
  }
  
  .search-row { 
    display: flex; 
    align-items: center; 
    width: 100%; 
    max-width: 600px; /* Wider search bar */
    margin: 0 auto; /* Center within the center section */
    gap: 8px; 
  }
  
  .search-inner { 
    display: flex; 
    flex: 1; 
  }

  .search-input {
      flex: 1; height: 36px; padding: 0 14px;
      background: var(--input-bg);
      border: 1px solid var(--input-border);
      border-right: none;
      border-radius: var(--r-full) 0 0 var(--r-full);
      color: var(--tx-1); font-size: 14px; font-family: var(--font); outline: none;
      transition: border-color 100ms ease, background 100ms ease;
    }
    .search-input:focus { border-color: var(--bd-2); background: var(--bg-overlay); }
    .search-input::placeholder { color: var(--tx-3); }

    .search-btn {
      height: 36px; width: 46px;
      background: var(--input-bg); border: 1px solid var(--input-border);
      border-radius: 0 var(--r-full) var(--r-full) 0;
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; color: var(--tx-2);
      transition: background 100ms ease, color 100ms ease;
    }
    .search-btn:hover { background: var(--bg-overlay); color: var(--tx-1); }

    .mic-btn {
      width: 36px; height: 36px; border-radius: 50%;
      background: var(--input-bg); border: 1px solid var(--input-border);
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; color: var(--tx-2); flex-shrink: 0;
      transition: background 100ms ease, color 100ms ease;
    }
    .mic-btn:hover { background: var(--bg-overlay); color: var(--tx-1); }

  /* RIGHT: fixed width mirrors left */
  .right {
    display: flex; 
    align-items: center; 
    justify-content: flex-end;
    gap: 6px; 
    flex-shrink: 0;
    width: 300px;
  }

  /* ALL buttons now have pill shape */
  .icon-btn, .create-btn, .lang-btn, .user-card {
    border-radius: 18px;
    transition: all 0.2s cubic-bezier(0.25, 0.1, 0.25, 1);
  }

  .icon-btn {
    position: relative;
    width: 36px; 
    height: 36px; 
    border: none; 
    background: transparent; 
    cursor: pointer;
    display: flex; 
    align-items: center; 
    justify-content: center;
    color: var(--icon-tx); 
    flex-shrink: 0;
  }
  .icon-btn:hover { 
    background: color-mix(in srgb, var(--tx-1) 8%, transparent);
    color: var(--tx-1);
  }
  .icon-btn:active { 
    background: color-mix(in srgb, var(--tx-1) 12%, transparent);
    transform: scale(0.96); 
  }
  
  .icon-btn.theme:hover { 
    transform: rotate(10deg);
  }

  .notif-dot {
    position: absolute; 
    top: 8px; 
    right: 8px;
    width: 6px; 
    height: 6px; 
    border-radius: 3px;
    background: var(--brand);
    border: none;
  }

  /* Create button - fixed vertical alignment */
  .create-btn {
    display: flex; 
    align-items: center; 
    justify-content: center;
    gap: 6px;
    height: 36px; 
    padding: 0 16px;
    border: 1px solid color-mix(in srgb, var(--tx-1) 25%, transparent);
    background: transparent;
    color: var(--tx-1);
    font-size: 13px; 
    font-weight: 500; 
    font-family: inherit; 
    cursor: pointer;
    white-space: nowrap; 
    flex-shrink: 0;
    line-height: 1;
  }
  .create-btn svg {
    width: 14px;
    height: 14px;
    display: block;
    margin: 0;
  }
  .create-btn:hover { 
    background: color-mix(in srgb, var(--tx-1) 8%, transparent);
    border-color: color-mix(in srgb, var(--tx-1) 35%, transparent);
    color: var(--tx-1);
  }

  /* Language button - fixed vertical alignment */
  .lang-btn {
    display: flex; 
    align-items: center; 
    justify-content: center;
    gap: 6px;
    height: 36px; 
    padding: 0 16px;
    border: 1px solid color-mix(in srgb, var(--tx-1) 25%, transparent);
    background: transparent;
    color: var(--tx-1);
    font-size: 12px; 
    font-weight: 500; 
    font-family: inherit; 
    cursor: pointer;
    white-space: nowrap; 
    flex-shrink: 0;
    line-height: 1;
  }
  .lang-btn svg {
    width: 14px;
    height: 14px;
    display: block;
    margin: 0;
  }
  .lang-btn:hover { 
    background: color-mix(in srgb, var(--tx-1) 8%, transparent);
    border-color: color-mix(in srgb, var(--tx-1) 35%, transparent);
    color: var(--tx-1);
  }
  .lang-btn:active { 
    background: color-mix(in srgb, var(--tx-1) 12%, transparent);
    transform: scale(0.97); 
  }

  /*
   * User profile card — no red border when opened
   */
  .user-card {
    display: flex; 
    align-items: center; 
    gap: 6px;
    padding: 3px 12px 3px 3px;
    border: 1px solid color-mix(in srgb, var(--tx-1) 25%, transparent);
    background: transparent;
    cursor: pointer; 
    flex-shrink: 0;
    min-width: 0;
    outline: none;
  }
  .user-card:hover { 
    background: color-mix(in srgb, var(--tx-1) 6%, transparent);
    border-color: color-mix(in srgb, var(--tx-1) 35%, transparent);
  }
  .user-card:active { 
    background: color-mix(in srgb, var(--tx-1) 10%, transparent);
    transform: scale(0.98); 
  }
  .user-card[aria-expanded="true"] { 
    background: color-mix(in srgb, var(--tx-1) 8%, transparent);
    border-color: color-mix(in srgb, var(--tx-1) 40%, transparent);
    box-shadow: 0 0 0 2px color-mix(in srgb, white 30%, transparent);
  }

  .user-av {
    width: 30px; 
    height: 30px; 
    border-radius: 15px;
    flex-shrink: 0;
    background: linear-gradient(135deg, #4285f4, #9c27b0);
    display: flex; 
    align-items: center; 
    justify-content: center;
    font-size: 13px; 
    font-weight: 500; 
    color: white;
  }

  /* Text block */
  .user-text {
    display: flex; 
    flex-direction: column;
    align-items: flex-start;
    line-height: 1.3; 
    min-width: 0;
  }
  .user-name { 
    font-size: 12px; 
    font-weight: 500; 
    color: var(--tx-1); 
    white-space: nowrap;
  }
  .user-email { 
    font-size: 9px; 
    color: var(--tx-3); 
    white-space: nowrap;
  }

  /* Chevron */
  .user-chevron { 
    color: var(--tx-3); 
    flex-shrink: 0; 
    transition: transform 0.2s ease;
  }
  .user-card[aria-expanded="true"] .user-chevron { 
    transform: rotate(180deg); 
  }

  /* ── Dropdown ── Apple style panel */
  .dropdown {
    position: fixed;
    top: calc(var(--header-h, 60px) + 8px);
    right: 20px;
    width: 260px;
    background: color-mix(in srgb, var(--bg-surface) 70%, transparent);
    backdrop-filter: blur(20px) saturate(180%);
    -webkit-backdrop-filter: blur(20px) saturate(180%);
    border: 1px solid var(--bd-1);
    border-radius: 20px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    z-index: calc(var(--z-header, 200) + 10);
    padding: 6px;
    animation: dd-in 0.2s ease;
  }
  @keyframes dd-in {
    from { 
      opacity: 0; 
      transform: translateY(-8px) scale(0.98); 
    }
    to { 
      opacity: 1; 
      transform: none; 
    }
  }

  .dd-head {
    display: flex; 
    align-items: center; 
    gap: 10px;
    padding: 10px 12px;
    border-bottom: 1px solid var(--bd-1);
  }
  .dd-av {
    width: 36px; 
    height: 36px; 
    border-radius: 18px;
    flex-shrink: 0;
    background: linear-gradient(135deg, #4285f4, #9c27b0);
    display: flex; 
    align-items: center; 
    justify-content: center;
    font-size: 14px; 
    font-weight: 500; 
    color: white;
  }
  .dd-name { 
    font-size: 13px; 
    font-weight: 500; 
    color: var(--tx-1); 
  }
  .dd-email { 
    font-size: 11px; 
    color: var(--tx-2); 
    margin-top: 1px; 
  }

  .dd-row {
    display: flex; 
    align-items: center; 
    gap: 10px;
    padding: 8px 12px; 
    border-radius: 14px;
    cursor: pointer; 
    border: none; 
    background: transparent;
    color: var(--tx-2); 
    font-size: 13px; 
    font-weight: 400;
    font-family: inherit; 
    width: 100%; 
    text-align: left;
    transition: background 0.15s ease;
  }
  .dd-row:hover { 
    background: color-mix(in srgb, var(--tx-1) 8%, transparent);
    color: var(--tx-1);
  }

  .dd-sep { 
    height: 1px; 
    background: var(--bd-1); 
    margin: 6px 0; 
  }

  .dd-signout {
    display: flex; 
    align-items: center; 
    gap: 10px;
    padding: 8px 12px; 
    border-radius: 14px;
    cursor: pointer; 
    border: none; 
    background: transparent;
    color: var(--brand); 
    font-size: 13px; 
    font-weight: 500;
    font-family: inherit; 
    width: 100%; 
    text-align: left;
    transition: background 0.15s ease;
  }
  .dd-signout:hover { 
    background: color-mix(in srgb, var(--brand) 8%, transparent);
  }

  /* Focus states - pure white, no red */
  *:focus-visible {
    outline: none;
  }

  /* Light mode adjustments */
  @media (prefers-color-scheme: light) {
    header {
      background: color-mix(in srgb, var(--header-bg) 50%, transparent);
    }
    
    .search-input, .search-btn, .mic-btn {
      background: color-mix(in srgb, #000 4%, transparent);
      border-color: color-mix(in srgb, #000 15%, transparent);
    }
    
    .create-btn, .lang-btn, .user-card {
      border-color: color-mix(in srgb, #000 20%, transparent);
    }
    
    .menu-btn:hover, .icon-btn:hover, .create-btn:hover, 
    .lang-btn:hover, .user-card:hover, .logo:hover {
      background: color-mix(in srgb, #000 4%, transparent);
    }
    
    .dropdown {
      background: color-mix(in srgb, var(--bg-surface) 60%, transparent);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
    }
    
    .user-card[aria-expanded="true"] {
      box-shadow: 0 0 0 2px color-mix(in srgb, black 20%, transparent);
    }
  }
`;

  private _q = '';
  private _theme: 'dark' | 'light' = 'dark';
  private _lang:  'EN'  | 'VI'     = 'EN';
  private _userOpen = false;
  private _platform: PlatformSidebarId = 'ytube';

  override connectedCallback(): void {
    super.connectedCallback();
    this._theme = getTheme();
    this._platform = resolvePlatformForPath(location.pathname);
    document.addEventListener('click', this._docClick.bind(this));
    on('route:changed', () => {
      this._platform = resolvePlatformForPath(location.pathname);
      this.requestUpdate();
    });
  }
  override disconnectedCallback(): void {
    super.disconnectedCallback();
    document.removeEventListener('click', this._docClick.bind(this));
  }

  private _docClick(e: Event): void {
    if (!this.renderRoot.contains(e.target as Node)) {
      if (this._userOpen) { this._userOpen = false; this.requestUpdate(); }
    }
  }

  private _submit(): void {
    if (!this._q.trim()) return;
    getRegisteredService<NavigationController>('Router')
      .push('/search?q=' + encodeURIComponent(this._q.trim()));
  }

  private _toggleTheme(): void { this._theme = toggleTheme(); this.requestUpdate(); }
  private _toggleLang():  void { this._lang  = this._lang === 'EN' ? 'VI' : 'EN'; this.requestUpdate(); }

  private _renderPlatformLogo() {
    const meta = PLATFORM_META[this._platform] ?? PLATFORM_META['ytube'];
    if (meta.wordmark) {
      return html`<span style="font-size:18px;font-weight:900;font-style:italic;color:${meta.color};letter-spacing:-0.5px;padding:0 2px">${meta.wordmark}</span>`;
    }
    return html`
      <div class="logo-mark" style="background:${meta.color}">
        <svg viewBox="0 0 24 24" width="14" height="14" fill="white">
          <path d="${meta.icon}"/>
        </svg>
      </div>
      <span class="logo-text">${meta.name}</span>`;
  }

  override render() {
    return html`
      <header>
        <!-- LEFT -->
        <div class="left">
          <button class="menu-btn" title="Toggle sidebars"
            @click=${() => this.dispatchEvent(new CustomEvent('menu-toggle',{bubbles:true,composed:true}))}>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
            </svg>
          </button>
          <a class="logo" href="/">
            ${this._renderPlatformLogo()}
          </a>
        </div>

        <!-- CENTER -->
        <div class="center">
          <div class="search-row">
            <div class="search-inner">
              <input class="search-input" type="search" placeholder="Search" autocomplete="off"
                @input=${(e:InputEvent)=>{ this._q=(e.target as HTMLInputElement).value; }}
                @keydown=${(e:KeyboardEvent)=>{ if(e.key==='Enter') this._submit(); }}/>
              <button class="search-btn" @click=${this._submit.bind(this)}>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                  <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                </svg>
              </button>
            </div>
            <button class="mic-btn" title="Voice search">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- RIGHT -->
        <div class="right">
          <button class="create-btn">
            <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
            Create
          </button>

          <!-- Language toggle -->
          <button class="lang-btn" @click=${this._toggleLang.bind(this)}
            title="${this._lang==='EN'?'Switch to Tiếng Việt':'Switch to English'}">
            <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor">
              <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm6.93 6h-2.95c-.32-1.25-.78-2.45-1.38-3.56 1.84.63 3.37 1.91 4.33 3.56zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2 0 .68.06 1.34.14 2H4.26zm.82 2h2.95c.32 1.25.78 2.45 1.38 3.56-1.84-.63-3.37-1.9-4.33-3.56zm2.95-8H5.08c.96-1.66 2.49-2.93 4.33-3.56C8.81 5.55 8.35 6.75 8.03 8zM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08 2.76-1.91 3.96zM14.34 14H9.66c-.09-.66-.16-1.32-.16-2 0-.68.07-1.35.16-2h4.68c.09.65.16 1.32.16 2 0 .68-.07 1.34-.16 2zm.25 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95c-.96 1.65-2.49 2.93-4.33 3.56zM16.36 14c.08-.66.14-1.32.14-2 0-.68-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2h-3.38z"/>
            </svg>
            ${this._lang === 'EN' ? 'EN' : 'VI'}
          </button>

          <!-- Notification -->
          <button class="icon-btn" title="Notifications">
            <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor">
              <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
            </svg>
            <span class="notif-dot"></span>
          </button>

          <!-- Theme -->
          <button class="icon-btn theme" title="Toggle theme" @click=${this._toggleTheme.bind(this)}>
            ${this._theme==='dark'
              ? html`<svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor"><path d="M20 8.69V4h-4.69L12 .69 8.69 4H4v4.69L.69 12 4 15.31V20h4.69L12 23.31 15.31 20H20v-4.69L23.31 12 20 8.69zM12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6zm0-10c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z"/></svg>`
              : html`<svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor"><path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-2.98 0-5.4-2.42-5.4-5.4 0-1.81.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z"/></svg>`}
          </button>

          <!-- User profile card — always visible, left-aligned text -->
          <button class="user-card" aria-expanded="${this._userOpen}"
            @click=${(e:Event)=>{e.stopPropagation();this._userOpen=!this._userOpen;this.requestUpdate();}}>
            <div class="user-av">U</div>
            <div class="user-text">
              <span class="user-name">User Name</span>
              <span class="user-email">user@gmail.com</span>
            </div>
            <svg class="user-chevron" viewBox="0 0 24 24" width="13" height="13" fill="currentColor">
              <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
            </svg>
          </button>
        </div>
      </header>

      ${this._userOpen ? html`
        <div class="dropdown">
          <div class="dd-head">
            <div class="dd-av">U</div>
            <div>
              <div class="dd-name">User Name</div>
              <div class="dd-email">user@gmail.com</div>
            </div>
          </div>
          <button class="dd-row">
            <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
            Your channel
          </button>
          <button class="dd-row">
            <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm4.24 16L12 15.45 7.77 18l1.12-4.81-3.73-3.23 4.92-.42L12 5l1.92 4.53 4.92.42-3.73 3.23L16.23 18z"/></svg>
            Memberships
          </button>
          <button class="dd-row" @click=${()=>{this._userOpen=false;this._toggleTheme();}}>
            <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor"><path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1z"/></svg>
            Appearance: ${this._theme==='dark'?'Light mode':'Dark mode'}
          </button>
          <button class="dd-row">
            <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
            Help &amp; feedback
          </button>
          <div class="dd-sep"></div>
          <button class="dd-signout">
            <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor"><path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/></svg>
            Sign out
          </button>
        </div>` : ''}
    `;
  }
}
if (!customElements.get('yt-header')) customElements.define('yt-header', YtHeader);
