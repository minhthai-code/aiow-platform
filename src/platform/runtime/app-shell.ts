import { LitElement, html, css } from 'lit';
import { html as staticHtml, unsafeStatic } from 'lit/static-html.js';
import { on } from '@core/runtime-api/event-bus';
import { getRegisteredService } from '@core/runtime-api/platform-element';
import type { NavigationController } from '@core/router/router';
import '@libs/components/layout/yt-header';
import '@libs/components/layout/yt-rail';
import { loadSidebar } from '@libs/components/layout/sidebars/index';
import { resolvePlatformForPath, type PlatformSidebarId } from '@platform/runtime/platform-sidebar-controller';

const SIDEBAR_TAG: Record<PlatformSidebarId, string> = {
  ytube:        'yt-secondary-sidebar',
  facebook:     'fb-secondary-sidebar',
  discord:      'discord-secondary-sidebar',
  spotify:      'spotify-secondary-sidebar',
  netflix:      'netflix-secondary-sidebar',
  professional: 'professional-secondary-sidebar',
  ai:           'ai-secondary-sidebar',
  learning:     'learning-secondary-sidebar',
  shopping:     'shopping-secondary-sidebar',
  marketplace:  'marketplace-secondary-sidebar',
  maps:         'maps-secondary-sidebar',
  transport:    'transport-secondary-sidebar',
  auth:         'auth-secondary-sidebar',
};

export class AppShell extends LitElement {
  static override properties = {
    _sidebarOpen: { type: Boolean, state: true },
    _allHidden:   { type: Boolean, state: true },
    _platform:    { type: String, state: true },
  };

  static override styles = css`
    :host {
      display: flex; flex-direction: column;
      height: 100vh; overflow: hidden;
      background: var(--bg-base); color: var(--tx-1);
    }

    .header-row { position: relative; flex-shrink: 0; }
    yt-header { display: block; }

    .sidebar-toggle {
      position: absolute;
      bottom: -14px;
      z-index: calc(var(--z-header, 200) + 10);
      left: calc(var(--rail-w, 64px) + var(--sidebar-w, 224px));
      transform: translateX(-50%);

      width: 28px; height: 28px;
      border-radius: 50%;
      border: 1.5px solid var(--bd-2);
      background: var(--bg-raised);
      cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 2px 10px rgba(0,0,0,0.28);
      color: var(--tx-2);

      transition:
        left 220ms cubic-bezier(0.4,0,0.2,1),
        opacity 220ms ease,
        background 100ms ease,
        border-color 100ms ease,
        box-shadow 100ms ease;
    }
    
    /* State when only full sidebar is closed (rail still visible) */
    .sidebar-toggle.sidebar-closed {
      left: calc(var(--rail-w, 64px));
    }
    
    /* State when both sidebars are closed - use CSS custom properties */
    .sidebar-toggle.all-hidden {
      left: 0;
      opacity: 0;
      pointer-events: none;
    }
    
    .sidebar-toggle:hover {
      background: var(--bg-overlay);
      border-color: var(--bd-3);
      box-shadow: 0 4px 14px rgba(0,0,0,0.35);
      color: var(--tx-1);
    }
    .sidebar-toggle svg {
      transition: transform 220ms cubic-bezier(0.4,0,0.2,1);
    }
    .sidebar-toggle.sidebar-closed svg { transform: rotate(180deg); }

    .body { display: flex; flex: 1; min-height: 0; overflow: hidden; }

    yt-rail {
      flex-shrink: 0;
      transition: width 220ms cubic-bezier(0.4,0,0.2,1), opacity 220ms ease;
    }
    yt-rail.hidden { width: 0 !important; opacity: 0; pointer-events: none; }

    .secondary {
      overflow: hidden;
      transition: width 220ms cubic-bezier(0.4,0,0.2,1), opacity 220ms ease;
    }
    .secondary.hidden { width: 0 !important; opacity: 0; pointer-events: none; }

    #route-outlet {
      flex: 1; min-width: 0;
      overflow-y: auto; overflow-x: hidden; height: 100%;
      scrollbar-width: thin;
      scrollbar-color: var(--bd-2) transparent;
    }
    #route-outlet::-webkit-scrollbar       { width: 5px; }
    #route-outlet::-webkit-scrollbar-track { background: transparent; }
    #route-outlet::-webkit-scrollbar-thumb { background: var(--bd-2); border-radius: 3px; }
    #route-outlet::-webkit-scrollbar-thumb:hover { background: var(--bd-3); }
  `;

  private _sidebarOpen = true;
  private _allHidden   = false;
  private _platform: PlatformSidebarId = resolvePlatformForPath(location.pathname);
  private _unsubs: Array<() => void> = [];

  override connectedCallback(): void {
    super.connectedCallback();
    void this._loadAndUpdateSidebar(this._platform);
    this._unsubs.push(
      on('sidebar:toggled', ({ collapsed }) => {
        this._allHidden = collapsed;
        this.requestUpdate();
      }),
      on('route:changed', () => {
        const next = resolvePlatformForPath(location.pathname);
        if (next !== this._platform) {
          this._platform = next;
          void this._loadAndUpdateSidebar(next);
        } else {
          this.requestUpdate();
        }
      }),
    );
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this._unsubs.forEach(u => u());
    this._unsubs = [];
  }

  getOutlet(): HTMLElement { return this.renderRoot.querySelector('#route-outlet') as HTMLElement; }

  private _toggleAll(): void {
    this._allHidden = !this._allHidden;
    if (!this._allHidden) this._sidebarOpen = true;
    this.requestUpdate();
  }

  private _toggleSidebar(): void {
    this._sidebarOpen = !this._sidebarOpen;
    this.requestUpdate();
  }

  private _nav(p: string): void {
    getRegisteredService<NavigationController>('Router').push(p);
  }

  private _sidebarLoaded = false;

  private async _loadAndUpdateSidebar(platform: PlatformSidebarId): Promise<void> {
    this._sidebarLoaded = false;
    await loadSidebar(platform);
    this._sidebarLoaded = true;
    this.requestUpdate();
  }

  private renderSecondarySidebar(sidebarHidden: boolean) {
    const cls = `secondary ${sidebarHidden ? 'hidden' : ''}`;
    const n   = (e: CustomEvent<string>) => this._nav(e.detail);
    const tag = SIDEBAR_TAG[this._platform];
    return staticHtml`<${unsafeStatic(tag)} class=${cls} @navigate=${n}></${unsafeStatic(tag)}>`;
  }

  override render() {
    const railHidden    = this._allHidden;
    const sidebarHidden = this._allHidden || !this._sidebarOpen;
    
    // Determine button class based on state
    let buttonClass = '';
    if (this._allHidden) {
      buttonClass = 'all-hidden';
    } else if (!this._sidebarOpen) {
      buttonClass = 'sidebar-closed';
    }

    return html`
      <div class="header-row">
        <yt-header @menu-toggle=${this._toggleAll.bind(this)}></yt-header>

        <!-- Button uses CSS classes only, no inline styles -->
        <button
          class="sidebar-toggle ${buttonClass}"
          aria-label="${this._sidebarOpen ? 'Close sidebar' : 'Open sidebar'}"
          aria-pressed="${!this._sidebarOpen}"
          title="${this._allHidden ? 'Both sidebars closed' : (this._sidebarOpen ? 'Close sidebar' : 'Open sidebar')}"
          @click=${this._toggleSidebar.bind(this)}
        >
          <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
          </svg>
        </button>
      </div>

      <div class="body">
        <yt-rail
          class=${railHidden ? 'hidden' : ''}
          @navigate=${(e: CustomEvent<string>) => this._nav(e.detail)}
        ></yt-rail>
        ${this.renderSecondarySidebar(sidebarHidden)}
        <div id="route-outlet"></div>
      </div>
    `;
  }
}

if (!customElements.get('yt-app')) customElements.define('yt-app', AppShell);