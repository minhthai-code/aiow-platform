import { LitElement, html, css } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import type { HomeStore, HomeState } from '../state/home-store';
import type { Video } from '@core/types';
import { getRegisteredService } from '@core/runtime-api/platform-element';
import type { NavigationController } from '@core/router/router';
import '@libs/components/media/yt-video-card';

/* ── Masthead backgrounds (rotate with dots) ── */
const MASTHEADS = [
  { brand:'Apple Vision Pro 2',    tagline:'The Future of\nSpatial Computing',    sub:'Experience the world in an entirely new dimension.', cta:'Explore Now', cta2:'Watch Film', thumb:'https://picsum.photos/seed/avp2025/1400/500',   accent:'#0a84ff' },
  { brand:'Samsung Galaxy S25 Ultra', tagline:'Redefine What a\nPhone Can Do',    sub:'AI-powered photography and performance at its peak.', cta:'Shop Now',    cta2:'See specs',  thumb:'https://picsum.photos/seed/s25ultra/1400/500', accent:'#1a6ed8' },
  { brand:'NVIDIA RTX 5090',       tagline:'Blackwell.\nBuilt for Creators.',     sub:'The most powerful GPU ever made for professionals.',  cta:'Learn More',  cta2:'Watch Demo', thumb:'https://picsum.photos/seed/rtx5090h/1400/500', accent:'#76b900' },
];

const CAROUSEL_ADS = [
  { id:'a1', brand:'Samsung Galaxy S25 Ultra', tagline:'Redefine What a Phone Can Do',    cta:'Shop Now',   thumb:'https://picsum.photos/seed/s25u/480/270',     accent:'#1a6ed8', top:'#0d1b4a' },
  { id:'a2', brand:'NVIDIA RTX 5090',          tagline:'Blackwell. Built for Creators.',  cta:'Learn More', thumb:'https://picsum.photos/seed/rtx5090/480/270',  accent:'#76b900', top:'#0a1a00' },
  { id:'a3', brand:'Sony WH-1000XM6',          tagline:'Silence the World. Hear Yours.', cta:'Buy Now',    thumb:'https://picsum.photos/seed/sonymx6/480/270',  accent:'#ff6b35', top:'#1a0800' },
  { id:'a4', brand:'DJI Neo Pro',              tagline:'Fly Further. Shoot Sharper.',     cta:'Discover',   thumb:'https://picsum.photos/seed/djineopro/480/270',accent:'#00c8ff', top:'#001a22' },
  { id:'a5', brand:'Tesla Model Y 2025',       tagline:'Every Road. Every Day.',          cta:'Order Now',  thumb:'https://picsum.photos/seed/tmy2025/480/270',  accent:'#e31937', top:'#1a0005' },
  { id:'a6', brand:'Bose QuietComfort Ultra',  tagline:'Sound Without Compromise.',       cta:'Try Now',    thumb:'https://picsum.photos/seed/boseqcu/480/270',  accent:'#ffd700', top:'#1a1400' },
];

const SHORTS = [
  { id:'s1', title:'GPT-5 in 60 seconds',             ch:'Fireship',       thumb:'https://picsum.photos/seed/gpt560/360/640',    views:'6.2M' },
  { id:'s2', title:'This sunset took 3 years',         ch:'NatGeo',         thumb:'https://picsum.photos/seed/nat3yr/360/640',    views:'14M'  },
  { id:'s3', title:'JS one-liners that slap 🔥',       ch:'Fireship',       thumb:'https://picsum.photos/seed/jsslap/360/640',    views:'9.1M' },
  { id:'s4', title:'SpaceX booster catch SLOW-MO',     ch:'SpaceX',         thumb:'https://picsum.photos/seed/sxslow/360/640',    views:'31M'  },
  { id:'s5', title:'The most beautiful math proof',    ch:'3Blue1Brown',    thumb:'https://picsum.photos/seed/3b1b25/360/640',    views:'4.8M' },
  { id:'s6', title:'CSS trick nobody uses',            ch:'Kevin Powell',   thumb:'https://picsum.photos/seed/csstrick/360/640',  views:'2.9M' },
];

export class YtHomePage extends LitElement {
  static override properties = {
    store:       { type: Object, attribute: false },
    _st:         { type: Object, state: true },
    _adIdx:      { type: Number, state: true },
    _masIdx:     { type: Number, state: true },
  };

  static override styles = css`
    :host { display:block; color:var(--tx-1); }

    /* ═══════ MASTHEAD ═══════ */
    .masthead {
      position:relative; width:100%; height:360px;
      overflow:hidden; cursor:pointer;
    }

    /* Each slide layer */
    .m-slide {
      position:absolute; inset:0;
      transition:opacity 700ms ease;
      pointer-events:none;
    }
    .m-slide.active { pointer-events:auto; }

    .m-slide img {
      width:100%; height:100%; object-fit:cover;
      filter:brightness(0.46);
    }
    .masthead-grad {
      position:absolute; inset:0;
      background:
        linear-gradient(to right, rgba(0,0,0,0.90) 0%, rgba(0,0,0,0.52) 52%, rgba(0,0,0,0.10) 80%),
        linear-gradient(to top,   rgba(0,0,0,0.65) 0%, transparent 55%);
    }

    .masthead-content {
      position:absolute; inset:0;
      display:flex; flex-direction:column; justify-content:center;
      padding:0 52px;
    }
    .m-eyebrow {
      display:flex; align-items:center; gap:8px; margin-bottom:12px;
    }
    .m-sponsor { font-size:10px; font-weight:800; letter-spacing:2px; text-transform:uppercase; color:rgba(255,255,255,0.50); }
    .m-dot-sep { width:3px; height:3px; border-radius:50%; background:rgba(255,255,255,0.32); }
    .m-brand   { font-size:10px; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; color:rgba(255,255,255,0.72); }

    .m-title {
      font-size:38px; font-weight:800; line-height:1.12;
      color:#fff; max-width:460px; margin-bottom:10px;
      white-space:pre-line; letter-spacing:-0.5px;
      text-shadow:0 2px 28px rgba(0,0,0,0.75);
    }
    .m-sub {
      font-size:14.5px; color:rgba(255,255,255,0.78);
      max-width:360px; margin-bottom:26px; line-height:1.5;
      text-shadow:0 1px 8px rgba(0,0,0,0.65);
    }
    .m-btns { display:flex; gap:12px; align-items:center; }
    .m-cta1 {
      display:inline-flex; align-items:center; gap:7px;
      padding:12px 26px; border-radius:999px;
      background:var(--masthead-accent,#0a84ff);
      color:#fff; font-size:14px; font-weight:700;
      border:none; cursor:pointer;
      box-shadow:0 4px 24px rgba(0,0,0,0.50);
      transition:opacity 120ms ease, transform 120ms ease;
    }
    .m-cta1:hover { opacity:0.88; transform:scale(1.03); }
    .m-cta2 {
      display:inline-flex; align-items:center; gap:7px;
      padding:11px 22px; border-radius:999px;
      background:rgba(255,255,255,0.13);
      border:1.5px solid rgba(255,255,255,0.36);
      color:rgba(255,255,255,0.90); font-size:14px; font-weight:600;
      cursor:pointer; backdrop-filter:blur(8px);
      transition:background 120ms ease, border-color 120ms ease;
    }
    .m-cta2:hover { background:rgba(255,255,255,0.22); border-color:rgba(255,255,255,0.58); }

    /* Slide dots — bottom-centre */
    .m-dots {
      position:absolute; bottom:18px; left:50%;
      transform:translateX(-50%);
      display:flex; gap:7px; align-items:center; z-index:10;
    }
    .m-dot {
      width:7px; height:7px; border-radius:50%;
      background:rgba(255,255,255,0.28);
      border:none; cursor:pointer; padding:0;
      transition:background 250ms ease, transform 250ms ease, width 250ms ease;
    }
    /* Active dot: elongated pill */
    .m-dot.active {
      width:22px; border-radius:4px;
      background:rgba(255,255,255,0.90);
    }
    .m-dot:not(.active):hover { background:rgba(255,255,255,0.55); }

    /* Masthead prev/next chevron buttons */
    .m-nav {
      position:absolute;
      top:50%; transform:translateY(-50%);
      width:40px; height:40px; border-radius:50%;
      background:rgba(0,0,0,0.45);
      border:1.5px solid rgba(255,255,255,0.22);
      display:flex; align-items:center; justify-content:center;
      cursor:pointer; color:rgba(255,255,255,0.88); z-index:12;
      backdrop-filter:blur(8px);
      transition:background 120ms ease, transform 120ms ease;
    }
    .m-nav:hover { background:rgba(0,0,0,0.65); transform:translateY(-50%) scale(1.08); }
    .m-nav:active { transform:translateY(-50%) scale(0.94); }
    .m-nav.prev { left:20px; }
    .m-nav.next { right:20px; }

    /* ═══════ FILTER BAR — apple premium chips ═══════ */
    .filter-bar {
      display:flex; align-items:center;
      padding:14px 20px 10px;
      position:sticky; top:0; z-index:var(--z-sticky,100);
      background:var(--bg-base);
      gap:8px;
      overflow-x:auto; scrollbar-width:none;
    }
    .filter-bar::-webkit-scrollbar { display:none; }

    /*
     * Apple-premium chip:
     * - pill shape (r-full)
     * - subtle glass surface
     * - NO transform/movement on hover or active
     * - active: only color changes (bright bg + inverse text)
     */
    .chip {
      display:inline-flex; align-items:center;
      padding:0 16px; height:30px;
      border-radius:var(--r-full,9999px);
      background:var(--chip-bg); border:1px solid var(--chip-border);
      color:var(--chip-tx); font-size:13px; font-weight:500;
      font-family:var(--font); cursor:pointer; white-space:nowrap; flex-shrink:0;
      outline:none;
      /* NO transform, NO movement — ONLY color transitions */
      transition: background 150ms ease, color 150ms ease, border-color 150ms ease;
    }
    .chip:hover {
      background:var(--chip-hover-bg);
      border-color:var(--chip-hover-bd);
      color:var(--chip-hover-tx);
      /* explicitly no transform */
      transform:none;
    }
    .chip:active {
      transform:none;  /* no scale */
    }
    /* Active: high-contrast filled pill, no size change */
    .chip.active {
      background:var(--tx-1);
      border-color:transparent;
      color:var(--tx-inv);
      font-weight:600;
      transform:none;  /* never moves */
    }

    /* ═══════ SECTION HEADER ═══════ */
    .sec-head {
      display:flex; align-items:center; gap:8px;
      padding:18px 20px 10px;
    }
    .sec-head h2 {
      font-size:15px; font-weight:700; color:var(--tx-1);
      flex:1; margin:0; display:flex; align-items:center; gap:7px;
    }
    .sec-head a { font-size:13px; font-weight:600; color:var(--brand); text-decoration:none; cursor:pointer; opacity:0.9; }
    .sec-head a:hover { opacity:1; }

    /* ═══════ AD CAROUSEL — 5 visible, arrow nav ═══════ */
    .ad-wrap { padding:0 20px 8px; position:relative; }
    .ad-viewport { overflow:hidden; border-radius:12px; position:relative; }
    .ad-track {
      display:flex; gap:12px;
      transition:transform 340ms cubic-bezier(0.4,0,0.2,1);
      will-change:transform;
    }

    /* 5 cards visible at once */
    .ad-card {
      flex-shrink:0;
      width:calc(20% - 9.6px);
      min-width:160px;
      border-radius:12px; overflow:hidden;
      cursor:pointer; position:relative;
      transition:box-shadow 150ms ease, filter 150ms ease;
    }
    .ad-card:hover { box-shadow:0 10px 28px rgba(0,0,0,0.48); filter:brightness(1.07); }

    .ad-thumb { position:relative; padding-top:56.25%; overflow:hidden; }
    .ad-thumb img {
      position:absolute; inset:0; width:100%; height:100%;
      object-fit:cover; transition:transform 400ms ease;
    }
    .ad-card:hover .ad-thumb img { transform:scale(1.06); }
    .ad-thumb::after {
      content:''; position:absolute; inset:0;
      background:linear-gradient(to top, rgba(0,0,0,0.80) 0%, rgba(0,0,0,0.06) 52%, transparent 100%);
    }
    .ad-accent-line { position:absolute; top:0; left:0; right:0; height:2.5px; z-index:3; border-radius:12px 12px 0 0; }
    .ad-badge {
      position:absolute; top:8px; left:8px; z-index:2;
      background:rgba(255,215,0,0.14); border:1px solid rgba(255,215,0,0.42);
      border-radius:4px; padding:1.5px 7px;
      font-size:8.5px; font-weight:800; letter-spacing:1.5px; text-transform:uppercase;
      color:rgba(255,215,0,0.92); backdrop-filter:blur(6px);
    }
    .ad-info { position:absolute; bottom:0; left:0; right:0; z-index:2; padding:10px 11px; }
    .ad-brand-name { font-size:9.5px; color:rgba(255,255,255,0.52); font-weight:600; letter-spacing:0.5px; margin-bottom:2px; }
    .ad-tagline    { font-size:12px; font-weight:700; color:#fff; margin-bottom:8px; line-height:1.25; }
    .ad-cta-btn {
      display:inline-flex; align-items:center; gap:4px;
      padding:4px 12px; border-radius:999px;
      background:rgba(255,255,255,0.94); color:#111;
      font-size:10.5px; font-weight:700; border:none; cursor:pointer;
      transition:opacity 100ms ease;
    }
    .ad-cta-btn:hover { opacity:0.86; }

    /*
     * Arrow nav — positioned INSIDE the viewport, overlaid on the top
     * right corner of card[0]→card[1] boundary and card[4] right edge.
     * Uses absolute position relative to .ad-viewport.
     * This keeps them fully visible and never hidden by the sidebar.
     */
    .ad-arrow {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: rgba(10,10,10,0.70);
      border: 1px solid rgba(255,255,255,0.20);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: #fff;
      z-index: 20;
      backdrop-filter: blur(10px);
      box-shadow: 0 2px 8px rgba(0,0,0,0.4);
      transition: background 100ms ease, transform 100ms ease, opacity 100ms ease;
    }
    .ad-arrow:hover { background:rgba(30,30,30,0.90); transform:translateY(-50%) scale(1.1); }
    .ad-arrow:active { transform:translateY(-50%) scale(0.92); }
    .ad-arrow.prev { left:5px; }
    .ad-arrow.next { right:5px; }
    .ad-arrow[disabled] { opacity:0.20; pointer-events:none; }

    /* ═══════ SHORTS ROW — 6 cards filling FULL ROW width ═══════ */
    .shorts-row {
      display:flex; gap:8px;
      padding:0 20px 10px;
      /* NO overflow — all 6 cards fit exactly in the full row */
    }

    .short-card {
      flex:1;                   /* each card takes equal share of row */
      min-width:0;              /* allow shrinking */
      border-radius:12px; cursor:pointer;
      overflow:hidden; position:relative;
      transition:background 100ms ease;
      padding:5px 5px 3px;
    }
    .short-card:hover { background:var(--bg-hover); }

    .short-thumb-wrap {
      position:relative; padding-top:177.78%;
      border-radius:9px; overflow:hidden;
      background:var(--bg-raised);
    }
    .short-thumb-wrap img { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; }
    .short-overlay { position:absolute; inset:0; background:linear-gradient(to top,rgba(0,0,0,0.70) 0%,transparent 44%); }
    .short-txt { position:absolute; bottom:0; left:0; right:0; padding:8px 8px 10px; }
    .short-title { font-size:11px; font-weight:600; color:#fff; line-height:1.3; margin-bottom:2px; display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden; }
    .short-views { font-size:10px; color:rgba(255,255,255,0.60); }

    /* 3-dot row below thumbnail */
    .short-meta {
      display:flex; align-items:center;
      padding:5px 2px 2px; gap:4px;
    }
    .short-ch { flex:1; font-size:11px; color:var(--tx-2); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
    .short-more {
      width:24px; height:24px; border-radius:50%; border:none;
      background:none; cursor:pointer;
      color:rgba(255,255,255,0.20);   /* very light white, always visible */
      display:flex; align-items:center; justify-content:center;
      transition:color 100ms ease, background 100ms ease;
    }
    /* In dark mode: text color overrides for the meta row */
    .short-ch { color:var(--tx-2); }
    .short-more { color:var(--tx-3); opacity:0.55; }
    .short-card:hover .short-more { opacity:1; color:var(--tx-1); background:var(--bg-hover); }

    /* ═══════ VIDEO GRID — 3 columns ═══════ */
    .grid {
      display:grid; grid-template-columns:repeat(3,1fr);
      gap:16px 8px; padding:4px 14px 60px;
    }
    @media(max-width:1100px){.grid{grid-template-columns:repeat(2,1fr)}}
    @media(max-width:700px) {.grid{grid-template-columns:1fr;padding:4px 8px 40px}}

    /* ═══════ SKELETON ═══════ */
    @keyframes sk{0%{background-position:200% 0}100%{background-position:-200% 0}}
    .sk { border-radius:4px; background:linear-gradient(90deg,var(--bg-raised) 25%,var(--bg-overlay) 50%,var(--bg-raised) 75%); background-size:200%; animation:sk 1.8s ease infinite; }
    .sk-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:16px 8px; padding:4px 14px 48px; }
    @media(max-width:1100px){.sk-grid{grid-template-columns:repeat(2,1fr)}}
    @media(max-width:700px){.sk-grid{grid-template-columns:1fr}}

    /* ═══════ STATES ═══════ */
    .empty { display:flex;flex-direction:column;align-items:center;justify-content:center;padding:80px 24px;gap:14px;text-align:center; }
    .empty h3 { font-size:18px;font-weight:500;color:var(--tx-2); }
    .empty p  { font-size:14px;color:var(--tx-3); }
    .retry { padding:10px 28px; border-radius:var(--r-full); background:var(--tx-1); color:var(--tx-inv); border:none; cursor:pointer; font-size:13px; font-weight:700; font-family:var(--font); }
    .retry:hover { opacity:0.85; }
  `;

  store!: HomeStore;
  private _st!: HomeState;
  private _unsub?: () => void;
  private _adIdx  = 0;
  private _masIdx = 0;
  private _masTimer?: ReturnType<typeof setInterval>;

  override connectedCallback(): void {
    super.connectedCallback();
    this._st    = this.store.getState();
    this._unsub = this.store.subscribe(s => { this._st = s; this.requestUpdate(); });
    // Auto-rotate masthead every 5s
    this._masTimer = setInterval(() => {
      this._masIdx = (this._masIdx + 1) % MASTHEADS.length;
      this.requestUpdate();
    }, 5000);
  }
  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this._unsub?.();
    clearInterval(this._masTimer);
  }

  private _nav(p: string) { getRegisteredService<NavigationController>('Router').push(p); }
  private _adPrev() { this._adIdx = Math.max(0, this._adIdx - 1); this.requestUpdate(); }
  private _adNext() { this._adIdx = Math.min(CAROUSEL_ADS.length - 5, this._adIdx + 1); this.requestUpdate(); }

  /* ── Masthead with slide dots ── */
  private _masthead() {
    const cur = MASTHEADS[this._masIdx]!;
    return html`
      <div class="masthead" style="--masthead-accent:${cur.accent}">

        <!-- Slides: one per masthead, cross-fade -->
        ${MASTHEADS.map((m, i) => html`
          <div class="m-slide" style="opacity:${i === this._masIdx ? 1 : 0}">
            <img src="${m.thumb}" alt="${m.brand}" loading="${i === 0 ? 'eager' : 'lazy'}"/>
            <div class="masthead-grad"></div>
          </div>`)}

        <!-- Content (always for current) -->
        <div class="masthead-content">
          <div class="m-eyebrow">
            <span class="m-sponsor">Sponsored</span>
            <span class="m-dot-sep"></span>
            <span class="m-brand">${cur.brand}</span>
          </div>
          <div class="m-title">${cur.tagline}</div>
          <div class="m-sub">${cur.sub}</div>
          <div class="m-btns">
            <button class="m-cta1">
              ${cur.cta}
              <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor"><path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/></svg>
            </button>
            <button class="m-cta2">
              <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
              ${cur.cta2}
            </button>
          </div>
        </div>

        <!-- Dot indicators -->
        <div class="m-dots">
          ${MASTHEADS.map((_, i) => html`
            <button class="m-dot ${i === this._masIdx ? 'active' : ''}"
              @click=${(e: Event) => { e.stopPropagation(); this._masIdx = i; this.requestUpdate(); }}>
            </button>`)}
        </div>

        <!-- Prev / Next nav arrows -->
        <button class="m-nav next"
          @click=${(e:Event)=>{ e.stopPropagation(); this._masIdx=(this._masIdx+1)%MASTHEADS.length; this.requestUpdate(); }}>
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>
        </button>
      </div>`;
  }

  /* ── Ad carousel — 5 visible, arrows ── */
  private _ads() {
    const canPrev = this._adIdx > 0;
    const canNext = this._adIdx < CAROUSEL_ADS.length - 5;
    // Width of one card + gap in percent of track
    const shift = this._adIdx * (20 + 2.4); // 20% card + 2.4% effective gap
    return html`
      <div class="sec-head">
        <h2>
          <svg viewBox="0 0 24 24" width="15" height="15" fill="#f59e0b">
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
          </svg>
          Featured &amp; Sponsored
        </h2>
      </div>
      <div class="ad-wrap">
        <button class="ad-arrow prev" ?disabled=${!canPrev} @click=${this._adPrev.bind(this)}>
          <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>
        </button>
        <div class="ad-viewport">
          <div class="ad-track" style="transform:translateX(calc(-${this._adIdx * (100/5)}% - ${this._adIdx * 12}px))">
            ${CAROUSEL_ADS.map(ad => html`
              <div class="ad-card">
                <div class="ad-accent-line" style="background:linear-gradient(90deg,${ad.accent},transparent)"></div>
                <div class="ad-thumb" style="background:linear-gradient(135deg,${ad.top},${ad.accent}28)">
                  <img src="${ad.thumb}" alt="${ad.brand}" loading="lazy"/>
                </div>
                <div class="ad-badge">Ad</div>
                <div class="ad-info">
                  <div class="ad-brand-name">${ad.brand}</div>
                  <div class="ad-tagline">${ad.tagline}</div>
                  <button class="ad-cta-btn">
                    ${ad.cta}
                    <svg viewBox="0 0 24 24" width="9" height="9" fill="currentColor"><path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/></svg>
                  </button>
                </div>
              </div>`)}
          </div>
        </div>
        <button class="ad-arrow next" ?disabled=${!canNext} @click=${this._adNext.bind(this)}>
          <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>
        </button>
      </div>`;
  }

  /* ── Shorts — 6 horizontal cards ── */
  private _shorts() {
    return html`
      <div class="sec-head">
        <h2>
          <svg viewBox="0 0 24 24" width="15" height="15" fill="#ef4444">
            <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
          </svg>
          Shorts
        </h2>
        <a @click=${()=>this._nav('/shorts')}>See all</a>
      </div>
      <div class="shorts-row">
        ${SHORTS.map(s => html`
          <div class="short-card">
            <div class="short-thumb-wrap">
              <img src="${s.thumb}" alt="${s.title}" loading="lazy"/>
              <div class="short-overlay"></div>
              <div class="short-txt">
                <div class="short-title">${s.title}</div>
                <div class="short-views">${s.views} views</div>
              </div>
            </div>
            <div class="short-meta">
              <span class="short-ch">${s.ch}</span>
              <button class="short-more" title="More options">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                  <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                </svg>
              </button>
            </div>
          </div>`)}
      </div>`;
  }

  private _skeletons() {
    return html`<div class="sk-grid">
      ${Array.from({length:9}).map(()=>html`
        <div style="padding:6px">
          <div class="sk" style="padding-top:56.25%;border-radius:10px;margin-bottom:10px"></div>
          <div style="display:flex;gap:9px">
            <div class="sk" style="width:32px;height:32px;border-radius:50%;flex-shrink:0"></div>
            <div style="flex:1;display:flex;flex-direction:column;gap:7px;padding-top:2px">
              <div class="sk" style="height:13px;width:90%;border-radius:4px"></div>
              <div class="sk" style="height:11px;width:58%;border-radius:4px"></div>
            </div>
          </div>
        </div>`)}
    </div>`;
  }

  override render() {
    const st = this._st;
    if (!st) return html``;

    return html`
      ${this._masthead()}

      <!-- Filter chips — pill shape, Apple style, NO movement -->
      <div class="filter-bar" role="tablist">
        ${st.filters.map(f => html`
          <button class="chip ${f===st.activeFilter?'active':''}" role="tab"
            @click=${()=>this.store.setFilter(f)}>${f}</button>`)}
      </div>

      <!-- Ad carousel — 5 visible -->
      ${this._ads()}

      <!-- Trending row — first 3 videos -->
      ${!st.loading && st.videos.length > 0 ? html`
        <div class="sec-head">
          <h2>
            <svg viewBox="0 0 24 24" width="15" height="15" fill="var(--brand)">
              <path d="M21.58 7.19c-.23-.86-.91-1.54-1.77-1.77C18.25 5 12 5 12 5s-6.25 0-7.81.42c-.86.23-1.54.91-1.77 1.77C2 8.75 2 12 2 12s0 3.25.42 4.81c.23.86.91 1.54 1.77 1.77C5.75 19 12 19 12 19s6.25 0 7.81-.42c.86-.23 1.54-.91 1.77-1.77C22 15.25 22 12 22 12s0-3.25-.42-4.81zM10 15V9l5.2 3-5.2 3z"/>
            </svg>
            Trending Now
          </h2>
        </div>
        <div class="grid" style="padding-bottom:8px"
          @video-click=${(e:CustomEvent<{videoId:string}>)=>this._nav('/watch?v='+e.detail.videoId)}
          @channel-click=${(e:CustomEvent<{channelId:string}>)=>this._nav('/channel/'+e.detail.channelId)}>
          ${repeat(st.videos.slice(0,3),(v:Video)=>v.id,(v:Video)=>html`<yt-video-card .video=${v}></yt-video-card>`)}
        </div>` : ''}

      <!-- Shorts — 6 horizontal -->
      ${this._shorts()}

      <!-- All videos -->
      <div class="sec-head">
        <h2>
          <svg viewBox="0 0 24 24" width="15" height="15" fill="var(--brand)">
            <path d="M21.58 7.19c-.23-.86-.91-1.54-1.77-1.77C18.25 5 12 5 12 5s-6.25 0-7.81.42c-.86.23-1.54.91-1.77 1.77C2 8.75 2 12 2 12s0 3.25.42 4.81c.23.86.91 1.54 1.77 1.77C5.75 19 12 19 12 19s6.25 0 7.81-.42c.86-.23 1.54-.91 1.77-1.77C22 15.25 22 12 22 12s0-3.25-.42-4.81zM10 15V9l5.2 3-5.2 3z"/>
          </svg>
          Videos
        </h2>
      </div>

      ${st.loading
        ? this._skeletons()
        : st.error
          ? html`<div class="empty"><h3>Something went wrong</h3><p>${st.error}</p><button class="retry" @click=${()=>this.store.loadFeed()}>Try again</button></div>`
          : st.videos.length===0
            ? html`<div class="empty"><h3>No videos found</h3><p>Try a different filter</p></div>`
            : html`
              <div class="grid"
                @video-click=${(e:CustomEvent<{videoId:string}>)=>this._nav('/watch?v='+e.detail.videoId)}
                @channel-click=${(e:CustomEvent<{channelId:string}>)=>this._nav('/channel/'+e.detail.channelId)}>
                ${repeat(st.videos.slice(3),(v:Video)=>v.id,(v:Video)=>html`<yt-video-card .video=${v}></yt-video-card>`)}
              </div>`}
    `;
  }
}
if (!customElements.get('yt-home-page')) customElements.define('yt-home-page', YtHomePage);
