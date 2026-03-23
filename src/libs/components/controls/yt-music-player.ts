import { LitElement, html, css } from 'lit';

export class YtMusicPlayer extends LitElement {
  static override properties = {
    playing:  { type: Boolean },
    progress: { type: Number  },
    liked:    { type: Boolean },
    menuOpen: { type: Boolean },
    albumArt: { type: String  },
  };

  static override styles = css`
    :host { 
      display: block; 
      width: 100%;
    }

    /*
     * Compact Apple Music Player for Sidebar
     * Smaller height, no border radius on container
     */
    .player {
      display: flex;
      flex-direction: column;
      padding: 8px 12px 4px;
      background: rgba(30, 30, 30, 0.75);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    /* Top row: Album + title + artist + heart + menu */
    .top-row {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 8px;
    }

    /* Album art */
    .art {
      width: 40px;
      height: 40px;
      border-radius: 6px;
      flex-shrink: 0;
      background-size: cover;
      background-position: center;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
      transition: transform 0.2s ease;
    }
    .art:hover { transform: scale(1.05); }

    .track-info {
      flex: 1;
      min-width: 0;
    }

    .track-title {
      font-size: 13px;
      font-weight: 600;
      color: #ffffff;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      letter-spacing: -0.2px;
      margin-bottom: 2px;
    }

    .track-artist {
      font-size: 11px;
      color: rgba(255, 255, 255, 0.5);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    /* Buttons */
    .icon-btn {
      width: 28px;
      height: 28px;
      border-radius: 6px;
      background: none;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      color: rgba(255, 255, 255, 0.5);
      padding: 0;
      transition: all 0.15s ease;
    }
    .icon-btn:hover { 
      color: #ffffff; 
      background: rgba(255, 255, 255, 0.08);
    }
    .icon-btn.liked { color: #ff2d55; }

    /* Progress bar */
    .progress-section {
      margin-bottom: 8px;
    }

    .prog-track {
      width: 100%;
      height: 3px;
      background: rgba(255, 255, 255, 0.15);
      border-radius: 4px;
      cursor: pointer;
      transition: height 0.15s ease;
    }
    .prog-track:hover { 
      height: 5px; 
      background: rgba(255, 255, 255, 0.2);
    }
    .prog-track:hover .prog-fill::after { opacity: 1; }

    .prog-fill {
      height: 100%;
      background: #ffffff;
      border-radius: 4px;
      position: relative;
      transition: width 0.2s ease;
      width: 38%;
    }

    .prog-fill::after {
      content: '';
      position: absolute;
      right: -5px;
      top: 50%;
      transform: translateY(-50%);
      width: 9px;
      height: 9px;
      border-radius: 50%;
      background: #ffffff;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
      opacity: 0;
      transition: opacity 0.15s ease;
    }

    /* Control row */
    .control-row {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 16px;
      margin-bottom: 4px;
    }

    .play-btn {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.95);
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #000000;
      padding: 0;
      box-shadow: 0 3px 8px rgba(0, 0, 0, 0.3);
      transition: all 0.15s ease;
    }
    .play-btn:hover { 
      background: #ffffff; 
      transform: scale(1.08);
    }

    .ctrl-btn {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.1);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      color: rgba(255, 255, 255, 0.7);
      padding: 0;
      transition: all 0.15s ease;
    }
    .ctrl-btn:hover { 
      color: #ffffff; 
      background: rgba(255, 255, 255, 0.15);
      border-color: rgba(255, 255, 255, 0.2);
      transform: scale(1.08);
    }

    /* Apple-style menu dropdown with animation */
    .menu-dropdown {
      position: absolute;
      bottom: 45px;
      right: 10px;
      background: rgba(40, 40, 40, 0.95);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 14px;
      padding: 6px;
      min-width: 180px;
      box-shadow: 0 15px 30px rgba(0, 0, 0, 0.6);
      z-index: 1000;
      transform-origin: bottom right;
      animation: menuPop 0.2s cubic-bezier(0.2, 0.9, 0.3, 1.1);
    }

    @keyframes menuPop {
      0% {
        opacity: 0;
        transform: scale(0.8) translateY(10px);
      }
      100% {
        opacity: 1;
        transform: scale(1) translateY(0);
      }
    }

    .menu-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 14px;
      border-radius: 10px;
      font-size: 13px;
      font-weight: 500;
      color: rgba(255, 255, 255, 0.9);
      cursor: pointer;
      border: none;
      background: none;
      width: 100%;
      text-align: left;
      transition: background 0.15s ease;
    }
    .menu-item:hover {
      background: rgba(255, 255, 255, 0.1);
      color: #ffffff;
    }

    .menu-item.liked {
      color: #ff2d55;
    }
    .menu-item.liked:hover {
      background: rgba(255, 45, 85, 0.15);
    }

    .menu-divider {
      height: 1px;
      background: rgba(255, 255, 255, 0.1);
      margin: 6px 0;
    }
  `;

  playing  = false;
  progress = 38;
  liked    = false;
  menuOpen = false;
  albumArt = 'https://picsum.photos/seed/album-cover/200/200';

  private _toggle(): void { 
    this.playing = !this.playing; 
    this.requestUpdate(); 
  }
  
  private _toggleLike(): void {
    this.liked = !this.liked;
    this.requestUpdate();
  }
  
  private _toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
    this.requestUpdate();
  }
  
  private _close(): void { 
    this.dispatchEvent(new CustomEvent('close', { bubbles: true, composed: true })); 
  }

  private _closeMenu(e: Event): void {
    e.stopPropagation();
    this.menuOpen = false;
    this.requestUpdate();
  }

  override render() {
    return html`
      <div class="player">
        <!-- Top: Album + title + artist + heart + menu -->
        <div class="top-row">
          <div class="art" style="background-image: url('${this.albumArt}');"></div>
          
          <div class="track-info">
            <div class="track-title">Blinding Lights</div>
            <div class="track-artist">The Weeknd</div>
          </div>

          <button class="icon-btn" @click=${this._toggleMenu.bind(this)}>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
            </svg>
          </button>
        </div>

        <!-- Progress bar (no timestamps) -->
        <div class="progress-section">
          <div class="prog-track">
            <div class="prog-fill" style="width: ${this.progress}%"></div>
          </div>
        </div>

        <!-- Controls below progress bar -->
        <div class="control-row">
          <button class="ctrl-btn">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
              <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
            </svg>
          </button>
          
          <button class="play-btn" @click=${this._toggle.bind(this)}>
            ${this.playing
              ? html`<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>`
              : html`<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>`}
          </button>
          
          <button class="ctrl-btn">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
              <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
            </svg>
          </button>
        </div>

        <!-- Apple-style dropdown menu with animation -->
        ${this.menuOpen ? html`
          <div class="menu-dropdown" @click=${(e: Event) => e.stopPropagation()}>
            <button class="menu-item ${this.liked ? 'liked' : ''}" @click=${(e: Event) => { e.stopPropagation(); this._toggleLike(); this._closeMenu(e); }}>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
              ${this.liked ? 'Remove from Liked' : 'Add to Liked'}
            </button>
            
            <div class="menu-divider"></div>
            
            <button class="menu-item" @click=${this._closeMenu}>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
              About
            </button>
            
            <button class="menu-item" @click=${this._closeMenu}>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-8 2l2 2h-2v6h-2V8H8l2-2h2z"/></svg>
              Audio Quality
            </button>
            
            <button class="menu-item" @click=${this._closeMenu}>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M19 10h3v2h-3v7h-2v-7h-3v-2h3v-3h2v3zm-7 5v-4c0-1.1-.9-2-2-2H6v9h2v-3h2c1.1 0 2-.9 2-2zm-2-2H8v2h2v-2zm8-9H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12v-2H4V6h16v6h2V6c0-1.1-.9-2-2-2z"/></svg>
              Lyrics
            </button>
            
            <div class="menu-divider"></div>
            
            <button class="menu-item" @click=${(e: Event) => { e.stopPropagation(); this._close(); this._closeMenu(e); }}>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
              Close Player
            </button>
          </div>
        ` : ''}
      </div>
    `;
  }
}

if (!customElements.get('yt-music-player')) customElements.define('yt-music-player', YtMusicPlayer);