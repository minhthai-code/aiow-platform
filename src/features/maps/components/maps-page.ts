import { LitElement, css, html } from 'lit';

const NEARBY = [
  { name:'Blue Bottle Coffee', cat:'Café', dist:'0.2 mi', rating:'4.8', open:true, img:'cafe1' },
  { name:'Tartine Bakery', cat:'Bakery', dist:'0.4 mi', rating:'4.9', open:true, img:'bak1' },
  { name:'State Bird Provisions', cat:'Restaurant', dist:'0.6 mi', rating:'4.7', open:false, img:'rest1' },
  { name:'Alamo Drafthouse', cat:'Cinema', dist:'0.8 mi', rating:'4.6', open:true, img:'cin1' },
];

export class MapsPage extends LitElement {
  static override styles = css`
    :host { display:flex; height:100%; background:var(--bg-base); color:var(--tx-1); font-family:-apple-system,BlinkMacSystemFont,'SF Pro Text',sans-serif; overflow:hidden; }

    /* Map placeholder (left) */
    .map-area { flex:1; position:relative; background:var(--bg-raised); overflow:hidden; }
    .map-placeholder {
      width:100%; height:100%;
      background:
        repeating-linear-gradient(0deg, transparent, transparent 48px, var(--bd-1) 48px, var(--bd-1) 49px),
        repeating-linear-gradient(90deg, transparent, transparent 48px, var(--bd-1) 48px, var(--bd-1) 49px),
        linear-gradient(135deg, var(--bg-raised) 0%, var(--bg-overlay) 100%);
      display:flex; align-items:center; justify-content:center;
    }
    .map-center { text-align:center; }
    .map-pin { font-size:48px; margin-bottom:8px; animation:bounce 2s ease infinite; }
    @keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
    .map-label { font-size:15px; font-weight:600; color:var(--tx-2); }
    .map-sub { font-size:12px; color:var(--tx-3); margin-top:4px; }

    /* Map controls */
    .map-controls { position:absolute; top:16px; left:16px; right:16px; display:flex; gap:8px; }
    .search-bar { flex:1; display:flex; align-items:center; background:var(--bg-surface); border:1px solid var(--bd-1); border-radius:12px; padding:0 12px; height:44px; gap:8px; box-shadow:var(--shadow-md); }
    .search-bar input { flex:1; border:none; background:none; color:var(--tx-1); font-size:14px; font-family:inherit; outline:none; }
    .dir-btn { height:44px; padding:0 18px; border-radius:12px; border:none; background:var(--bg-surface); border:1px solid var(--bd-1); color:var(--tx-1); font-size:13px; font-weight:600; cursor:pointer; font-family:inherit; box-shadow:var(--shadow-md); display:flex; align-items:center; gap:6px; }

    .mode-btns { position:absolute; bottom:20px; left:50%; transform:translateX(-50%); display:flex; gap:6px; background:var(--bg-surface); border:1px solid var(--bd-1); border-radius:999px; padding:4px; box-shadow:var(--shadow-md); }
    .mode-btn { padding:7px 18px; border-radius:999px; border:none; background:none; color:var(--tx-2); font-size:13px; font-weight:500; cursor:pointer; transition:background 100ms, color 100ms; font-family:inherit; }
    .mode-btn.active { background:var(--tx-1); color:var(--tx-inv); }

    .zoom-btns { position:absolute; bottom:20px; right:16px; display:flex; flex-direction:column; gap:4px; }
    .zoom-btn { width:36px; height:36px; border-radius:10px; border:1px solid var(--bd-1); background:var(--bg-surface); color:var(--tx-1); font-size:18px; font-weight:300; cursor:pointer; display:flex; align-items:center; justify-content:center; box-shadow:var(--shadow-sm); }

    /* Side panel (right) */
    .panel { width:320px; flex-shrink:0; display:flex; flex-direction:column; border-left:1px solid var(--bd-1); background:var(--bg-surface); }
    .panel-head { padding:16px; border-bottom:1px solid var(--bd-1); }
    .panel-title { font-size:16px; font-weight:700; margin-bottom:4px; }
    .panel-sub { font-size:12px; color:var(--tx-3); }
    .panel-scroll { flex:1; overflow-y:auto; scrollbar-width:thin; scrollbar-color:var(--bd-1) transparent; }

    .place-card { display:flex; gap:12px; padding:14px 16px; border-bottom:1px solid var(--bd-1); cursor:pointer; transition:background 100ms; }
    .place-card:hover { background:var(--bg-hover); }
    .place-img { width:64px; height:64px; border-radius:10px; object-fit:cover; flex-shrink:0; }
    .place-name { font-size:14px; font-weight:600; margin-bottom:3px; }
    .place-cat  { font-size:12px; color:var(--tx-2); margin-bottom:5px; }
    .place-meta { display:flex; align-items:center; gap:6px; font-size:11.5px; }
    .rating { color:#f59e0b; font-weight:700; }
    .open-tag { font-size:10.5px; font-weight:600; padding:2px 7px; border-radius:4px; }
    .open-tag.open { background:rgba(29,185,84,0.12); color:#1db954; }
    .open-tag.closed { background:rgba(239,68,68,0.10); color:#ef4444; }

    .directions-section { padding:14px 16px; }
    .dir-title { font-size:14px; font-weight:700; margin-bottom:10px; }
    .route-card { background:var(--bg-raised); border-radius:12px; padding:12px 14px; margin-bottom:8px; cursor:pointer; transition:background 100ms; }
    .route-card:hover { background:var(--bg-overlay); }
    .route-row { display:flex; align-items:center; justify-content:space-between; }
    .route-mode { font-size:13px; font-weight:600; display:flex; align-items:center; gap:6px; }
    .route-time { font-size:16px; font-weight:800; }
    .route-dist { font-size:11.5px; color:var(--tx-3); }
  `;

  private _mode = 'Driving';

  override render() {
    return html`
      <!-- Map -->
      <div class="map-area">
        <div class="map-placeholder">
          <div class="map-center">
            <div class="map-pin">📍</div>
            <div class="map-label">Interactive Map</div>
            <div class="map-sub">San Francisco, CA</div>
          </div>
        </div>

        <div class="map-controls">
          <div class="search-bar">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="var(--tx-3)"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
            <input placeholder="Search places, addresses…"/>
          </div>
          <button class="dir-btn">
            <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor"><path d="M22.43 10.59l-9.01-9.01c-.75-.75-2.07-.76-2.83 0l-9 9c-.78.78-.78 2.04 0 2.82l9 9c.39.39.9.58 1.41.58.51 0 1.02-.19 1.41-.58l8.99-9c.79-.76.8-2.02.03-2.81zM13 18.01V13h-2v5.01H7l5-5 5 5h-4z"/></svg>
            Directions
          </button>
        </div>

        <div class="mode-btns">
          ${['Driving','Walking','Transit','Cycling'].map(m => html`
            <button class="mode-btn ${this._mode===m?'active':''}" @click=${()=>{this._mode=m;this.requestUpdate();}}>${m}</button>`)}
        </div>

        <div class="zoom-btns">
          <button class="zoom-btn">+</button>
          <button class="zoom-btn">−</button>
        </div>
      </div>

      <!-- Side panel -->
      <div class="panel">
        <div class="panel-head">
          <div class="panel-title">Nearby Places</div>
          <div class="panel-sub">Based on your current location</div>
        </div>
        <div class="panel-scroll">
          ${NEARBY.map(p => html`
            <div class="place-card">
              <img class="place-img" src="https://picsum.photos/seed/${p.img}/80/80" alt="${p.name}" loading="lazy"/>
              <div>
                <div class="place-name">${p.name}</div>
                <div class="place-cat">${p.cat} · ${p.dist}</div>
                <div class="place-meta">
                  <span class="rating">★ ${p.rating}</span>
                  <span class="open-tag ${p.open?'open':'closed'}">${p.open?'Open now':'Closed'}</span>
                </div>
              </div>
            </div>`)}

          <div class="directions-section">
            <div class="dir-title">Route Options</div>
            ${[{m:'🚗 Driving',t:'12 min',d:'4.2 mi'},{m:'🚶 Walking',t:'48 min',d:'2.1 mi'},{m:'🚌 Transit',t:'22 min',d:'—'}].map(r => html`
              <div class="route-card">
                <div class="route-row">
                  <span class="route-mode">${r.m}</span>
                  <span class="route-time">${r.t}</span>
                </div>
                <div class="route-dist">${r.d}</div>
              </div>`)}
          </div>
        </div>
      </div>
    `;
  }
}
if (!customElements.get('maps-page')) customElements.define('maps-page', MapsPage);
