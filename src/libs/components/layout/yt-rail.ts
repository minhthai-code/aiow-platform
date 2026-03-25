import { LitElement, html, css } from 'lit';

interface Item { 
  id: string; 
  path: string; 
  title: string; 
  icon: string;
  color: string;
  group: string;
}

const ITEMS: Item[] = [
  // Group 1: Social & Communication
  { 
    id:'social', 
    path:'/social', 
    title:'Social Media', 
    color: '#1877F2',
    group: 'social',
    icon:'M12 4a2 2 0 110 4 2 2 0 010-4zm6 6a2 2 0 110 4 2 2 0 010-4zM6 10a2 2 0 110 4 2 2 0 010-4zm6 6a2 2 0 110 4 2 2 0 010-4zm-4-5l3-2 3 2M8 12l3 2 3-2'
  },
  { 
    id:'chat', 
    path:'/chat', 
    title:'Chat & Voice', 
    color: '#5865F2',
    group: 'social',
    icon:'M4 4h16a2 2 0 012 2v9a2 2 0 01-2 2H9l-5 4v-4H4a2 2 0 01-2-2V6a2 2 0 012-2z'
  },

  // Group 2: Media & Entertainment
  { 
    id:'video', 
    path:'/videos', 
    title:'Video Platform', 
    color: '#FF0000',
    group: 'media',
    icon:'M10 8.5v7l6-3.5-6-3.5zM21 6v12c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2h14c1.1 0 2 .9 2 2zm-2 0H5v12h14V6z'
  },
  { 
    id:'music', 
    path:'/music', 
    title:'Music', 
    color: '#1DB954',
    group: 'media',
    icon:'M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z'
  },
  { 
    id:'streaming', 
    path:'/streaming', 
    title:'Streaming', 
    color: '#E50914',
    group: 'media',
    icon:'M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2V6zm6-2v14m6-12v14'
  },

  // Group 3: Professional & Productivity
  { 
    id:'professional', 
    path:'/professional', 
    title:'Professional', 
    color: '#0A66C2',
    group: 'professional',
    icon:'M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-1 .05 1.16.84 2 1.87 2 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z'
  },
  { 
    id:'ai', 
    path:'/ai', 
    title:'AI Tools', 
    color: '#8A2BE2',
    group: 'professional',
    icon:'M12 3l3 3-3 3-3-3 3-3zm6 6l3 3-3 3-3-3 3-3zm-12 0l3 3-3 3-3-3 3-3zm6 6l3 3-3 3-3-3 3-3z'
  },
  { 
    id:'learning', 
    path:'/learning', 
    title:'Learning', 
    color: '#FF6B6B',
    group: 'professional',
    icon:'M12 3L2 8l10 5 10-5-10-5zm-6 8v5l6 3 6-3v-5'
  },

  // Group 4: Shopping & Services
  { 
    id:'shopping', 
    path:'/shopping', 
    title:'Shopping', 
    color: '#FF9900',
    group: 'shopping',
    icon:'M6 7h12l1 13H5L6 7zm3 0V5a3 3 0 016 0v2'
  },
  { 
    id:'marketplace', 
    path:'/marketplace', 
    title:'Marketplace', 
    color: '#662d91',
    group: 'shopping',
    icon:'M12 2C7.03 2 3 6.03 3 11s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9zm0 16c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7zm1-11h-2v3H8v2h3v3h2v-3h3v-2h-3V7z'
  },

  // Group 5: Navigation & Transport
  { 
    id:'maps', 
    path:'/maps', 
    title:'Maps & Navigation', 
    color: '#3c87e9',
    group: 'navigation',
    icon:'M12 2C7.6 2 4 5.6 4 10c0 5.4 8 12 8 12s8-6.6 8-12c0-4.4-3.6-8-8-8zm0 11a3 3 0 110-6 3 3 0 010 6z'
  },
  { 
    id:'transport', 
    path:'/transport', 
    title:'Transportation', 
    color: '#34A853',
    group: 'navigation',
    icon:'M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z'
  },
];

// Help button item with "?" icon
const HELP_ITEM: Item = {
  id:'help',
  path:'/help',
  title:'Help & Support',
  color: '#ffffff',
  group: 'help',
  icon: 'M12 2a10 10 0 100 20 10 10 0 000-20zm0 15h-1.5v-1.5H12V17zm2.07-7.75l-.9.92c-.73.74-1.17 1.33-1.17 2.33h-1.5v-.38c0-1 .44-1.83 1.17-2.56l1.24-1.26a1.99 1.99 0 10-3.41-1.41H8a3.5 3.5 0 116.07 2.16z'
};

export class YtRail extends LitElement {
  static override properties = { _active: { type: String, state: true } };

  static override styles = css`
    :host {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: var(--rail-w, 72px);
      padding: 12px 0 0 0;
      background: var(--sidebar-bg, #0d0d0d);
      flex-shrink: 0;
      height: 100vh;
      box-sizing: border-box;
      overflow: visible;
    }

    /* Main content container that scrolls */
    .content {
      flex: 0 1 auto; /* Changed from flex: 1 to only take needed space */
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
      overflow-y: visible; /* Changed from auto to visible */
      overflow-x: hidden;
      padding-bottom: 0;
      max-height: calc(100vh - 100px); /* Leave space for help button */
    }
    .content::-webkit-scrollbar {
      display: none;
    }

    /* Help button container - fixed at bottom */
    .help-container {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      flex-shrink: 0;
      padding: 8px 0 12px 0;
      background: var(--sidebar-bg, #0d0d0d);
      margin-top: auto; /* This pushes it to the bottom */
      position: sticky;
      bottom: 0;
      z-index: 10;
    }

    /* Ensure help button row is visible */
    .help-container .row {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    /* Group container */
    .group {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
      position: relative;
      margin: 4px 0;
    }

    /* Divider - slightly lighter white */
    .divider {
      width: 32px;
      height: 1px;
      background: rgba(255, 255, 255, 0.5);
      margin: 8px 0;
    }

    /* First group doesn't need top divider */
    .group:first-of-type {
      margin-top: 0;
    }

    .row {
      position: relative;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    /* Left-edge active indicator bar */
    .bar {
      position: absolute;
      left: 0;
      top: 50%;
      width: 3px;
      height: 0;
      border-radius: 0 3px 3px 0;
      background: white;
      box-shadow: 0 0 8px rgba(255,255,255,0.5);
      transform: translateY(-50%);
      transition: height 220ms cubic-bezier(0.34,1.56,0.64,1), background 220ms ease;
      z-index: 2;
    }
    
    .row.active .bar {
      background: color-mix(in srgb, var(--brand-color) 95%, white);
      box-shadow: 0 0 12px var(--brand-color);
      height: 32px;
    }

    /* Subtle glow effect */
    .bar::after {
      content: '';
      position: fixed;
      left: 0;
      top: 50%;
      width: 20px;
      height: 40px;
      border-radius: 0 50% 50% 0;
      background: radial-gradient(ellipse at 0% 50%, 
        var(--glow-color, rgba(255,255,255,0.15)) 0%,
        var(--glow-color, rgba(255,255,255,0.08)) 33%,
        transparent 60%
      );
      transform: translateY(-50%) translateX(-100%);
      opacity: 0;
      filter: blur(3px);
      transition: opacity 400ms ease, transform 400ms cubic-bezier(0.34,1.56,0.64,1);
      pointer-events: none;
      z-index: 1000;
    }

    .bar::before {
      content: '';
      position: fixed;
      left: 0;
      top: 50%;
      width: 32px;
      height: 64px;
      border-radius: 0 50% 50% 0;
      background: radial-gradient(ellipse at 0% 50%, 
        var(--glow-color, rgba(255,255,255,0.1)) 0%,
        var(--glow-color, rgba(255,255,255,0.05)) 33%,
        var(--glow-color, rgba(255,255,255,0.02)) 66%,
        transparent 85%
      );
      transform: translateY(-50%) translateX(-100%);
      opacity: 0;
      filter: blur(6px);
      transition: opacity 450ms ease, transform 450ms cubic-bezier(0.34,1.56,0.64,1);
      pointer-events: none;
      z-index: 999;
    }

    .bar .glow-outer {
      content: '';
      position: fixed;
      left: 0;
      top: 50%;
      width: 44px;
      height: 88px;
      border-radius: 0 50% 50% 0;
      background: radial-gradient(ellipse at 0% 50%, 
        var(--glow-color, rgba(255,255,255,0.06)) 0%,
        var(--glow-color, rgba(255,255,255,0.03)) 33%,
        var(--glow-color, rgba(255,255,255,0.01)) 66%,
        transparent 90%
      );
      transform: translateY(-50%) translateX(-100%);
      opacity: 0;
      filter: blur(10px);
      transition: opacity 500ms ease, transform 500ms cubic-bezier(0.34,1.56,0.64,1);
      pointer-events: none;
      z-index: 998;
    }

    .row.active .bar::after,
    .row.active .bar::before,
    .row.active .glow-outer {
      opacity: 0.7;
      transform: translateY(-50%) translateX(0);
    }

    .btn {
      position: relative;
      width: 48px;
      height: 48px;
      border-radius: 14px;
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; border: none;
      background: transparent;
      overflow: hidden;
      transition: background 120ms ease, border-radius 200ms cubic-bezier(0.34,1.56,0.64,1);
    }

    svg {
      position: relative;
      z-index: 1;
      width: 22px;
      height: 22px;
      transition: transform 180ms cubic-bezier(0.34,1.56,0.64,1), fill 180ms ease;
      fill: white;
    }

    .row.active svg {
      fill: var(--brand-color);
    }

    .btn::before {
      content: '';
      position: absolute; inset: 0;
      border-radius: inherit;
      background: linear-gradient(100deg, var(--rail-glow, rgba(200,50,30,0.15)) 0%, transparent 100%);
      opacity: 0;
      transform: translateX(-100%);
      transition: opacity 200ms ease, transform 200ms cubic-bezier(0,0,0.2,1);
    }
    .btn:hover::before { opacity: 0.6; transform: translateX(0); }

    .btn:hover {
      background: var(--bg-hover, rgba(255,255,255,0.04));
      border-radius: 16px;
    }

    .btn:hover svg {
      filter: brightness(1.1);
    }

    .btn:active { transform: scale(0.86); }

    .row.active .btn {
      background: var(--bg-active, rgba(255,255,255,0.06));
      border-radius: 16px;
    }

    /* Light mode */
    @media (prefers-color-scheme: light) {
      :host {
        background: var(--sidebar-bg, #f5f5f5);
        border-right: 1px solid var(--sidebar-bd, rgba(0,0,0,0.08));
      }
      
      .help-container {
        background: var(--sidebar-bg, #f5f5f5);
        border-top: 0px solid rgba(0, 0, 0, 0.15);
      }
      
      .divider {
        background: rgba(0, 0, 0, 0.15);
      }
      
      .bar {
        background: #4a4a4a;
        box-shadow: 0 0 8px rgba(0,0,0,0.15);
      }
      
      .row.active .bar {
        background: var(--brand-color);
        box-shadow: 0 0 12px var(--brand-color);
      }
      
      svg {
        fill: #4a4a4a;
      }
      
      .btn:hover {
        background: var(--bg-hover, rgba(0,0,0,0.02));
      }
      
      .row.active .btn {
        background: var(--bg-active, rgba(0,0,0,0.04));
      }
      
      .row.active .bar::after,
      .row.active .bar::before,
      .row.active .glow-outer {
        opacity: 0.3;
      }
    }
  `;

  private _active = '/social';

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

  private _item(item: Item) {
    const active = this._active === item.path;
    const hexToRgba = (hex: string) => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return `${r}, ${g}, ${b}`;
    };
    
    const rgb = item.color === '#000000' ? '255, 255, 255' : hexToRgba(item.color);
    
    return html`
      <div class="row ${active ? 'active' : ''}" style="--brand-color: ${item.color}">
        <div class="bar">
          <div class="glow-outer" style="--glow-color: rgba(${rgb}, 0.1)"></div>
        </div>
        <button class="btn" title="${item.title}" aria-label="${item.title}"
          aria-current="${active ? 'page' : 'false'}"
          @click=${() => this._nav(item.path)}>
          <svg viewBox="0 0 24 24">
            <path d="${item.icon}"/>
          </svg>
        </button>
      </div>`;
  }

  override render() {
    // Group items
    const groups = new Map<string, Item[]>();
    ITEMS.forEach(item => {
      if (!groups.has(item.group)) {
        groups.set(item.group, []);
      }
      groups.get(item.group)!.push(item);
    });

    const groupEntries = Array.from(groups.entries());
    
    return html`
      <div class="content">
        ${groupEntries.map(([groupName, items], index) => html`
          ${index > 0 ? html`<div class="divider"></div>` : ''}
          <div class="group" data-group="${groupName}">
            ${items.map(item => this._item(item))}
          </div>
        `)}
      </div>
      
      <div class="help-container">
        <div class="row help-row ${this._active === HELP_ITEM.path ? 'active' : ''}" 
             style="--brand-color: ${HELP_ITEM.color}">
          <div class="bar">
            <div class="glow-outer" style="--glow-color: rgba(255,255,255,0.1)"></div>
          </div>
          <button class="btn" title="${HELP_ITEM.title}" aria-label="${HELP_ITEM.title}"
            aria-current="${this._active === HELP_ITEM.path ? 'page' : 'false'}"
            @click=${() => this._nav(HELP_ITEM.path)}>
            <svg viewBox="0 0 24 24">
              <path d="${HELP_ITEM.icon}"/>
            </svg>
          </button>
        </div>
      </div>
    `;
  }
}

if (!customElements.get('yt-rail')) customElements.define('yt-rail', YtRail);