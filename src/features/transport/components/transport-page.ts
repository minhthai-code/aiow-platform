import { LitElement, css, html } from 'lit';

const RIDE_TYPES = [
  { id:'std', name:'Standard', cap:'1–4', time:'3 min', price:'$12–16', icon:'🚗', desc:'Everyday rides' },
  { id:'com', name:'Comfort',  cap:'1–4', time:'5 min', price:'$18–24', icon:'🚙', desc:'Newer cars', badge:'Popular' },
  { id:'xl',  name:'XL',       cap:'1–6', time:'7 min', price:'$22–30', icon:'🚐', desc:'Extra space' },
  { id:'prem',name:'Premium',  cap:'1–4', time:'6 min', price:'$34–48', icon:'🏎', desc:'Luxury cars', badge:'Premium' },
];

const RECENT = [
  { from:'Home', to:'Work', price:'$14.20', date:'Today, 9:02 AM', driver:'Maria G.', rating:'5.0' },
  { from:'SFO Airport', to:'Downtown Hotel', price:'$42.80', date:'Yesterday', driver:'James K.', rating:'4.9' },
  { from:'Work', to:'Gym', price:'$8.50', date:'Mon, Jun 10', driver:'Priya S.', rating:'5.0' },
];

export class TransportPage extends LitElement {
  static override properties = { _selected:{ type:String, state:true } };
  static override styles = css`
    :host { display:block; min-height:100%; background:var(--bg-base); color:var(--tx-1); font-family:-apple-system,BlinkMacSystemFont,'SF Pro Text',sans-serif; }
    .layout { display:flex; gap:24px; max-width:1100px; margin:0 auto; padding:24px 20px; }

    /* Left: booking */
    .booking { flex:1; max-width:480px; }
    .booking-card { background:var(--bg-surface); border:1px solid var(--bd-1); border-radius:20px; padding:24px; margin-bottom:16px; }
    .booking-title { font-size:22px; font-weight:800; margin-bottom:20px; }
    .route-inputs { display:flex; flex-direction:column; gap:0; margin-bottom:20px; }
    .route-field { display:flex; align-items:center; gap:10px; padding:12px 14px; background:var(--bg-raised); border:1.5px solid var(--bd-1); }
    .route-field:first-child { border-radius:12px 12px 0 0; border-bottom:none; }
    .route-field:last-child  { border-radius:0 0 12px 12px; }
    .route-dot { width:10px; height:10px; border-radius:50%; flex-shrink:0; }
    .route-field input { flex:1; border:none; background:none; color:var(--tx-1); font-size:14px; font-family:inherit; outline:none; }
    .route-swap { display:flex; justify-content:flex-end; margin:-8px 0; padding-right:14px; z-index:1; position:relative; }
    .swap-btn { width:28px; height:28px; border-radius:50%; border:2px solid var(--bd-1); background:var(--bg-surface); cursor:pointer; display:flex; align-items:center; justify-content:center; color:var(--tx-2); font-size:16px; }

    /* Ride type selector */
    .rides { display:flex; flex-direction:column; gap:10px; margin-bottom:20px; }
    .ride-card { display:flex; align-items:center; gap:14px; padding:14px 16px; border-radius:14px; border:1.5px solid var(--bd-1); cursor:pointer; transition:border-color 120ms, background 120ms; position:relative; }
    .ride-card:hover { background:var(--bg-hover); }
    .ride-card.selected { border-color:var(--tx-1); background:var(--bg-raised); }
    .ride-icon { font-size:28px; flex-shrink:0; }
    .ride-info { flex:1; }
    .ride-name { font-size:14px; font-weight:700; display:flex; align-items:center; gap:6px; }
    .ride-desc { font-size:12px; color:var(--tx-2); margin-top:2px; }
    .ride-price { font-size:15px; font-weight:700; text-align:right; }
    .ride-time  { font-size:11.5px; color:var(--tx-3); text-align:right; }
    .ride-badge { font-size:10px; font-weight:700; padding:2px 7px; border-radius:4px; background:rgba(255,153,0,0.12); color:#ff9900; }

    .request-btn { width:100%; padding:14px; border-radius:14px; border:none; background:var(--tx-1); color:var(--tx-inv); font-size:15px; font-weight:700; cursor:pointer; font-family:inherit; transition:opacity 100ms; }
    .request-btn:hover { opacity:0.88; }

    /* Map placeholder */
    .map-mini { height:200px; border-radius:16px; margin-bottom:16px; background:
      repeating-linear-gradient(0deg,transparent,transparent 32px,var(--bd-1) 32px,var(--bd-1) 33px),
      repeating-linear-gradient(90deg,transparent,transparent 32px,var(--bd-1) 32px,var(--bd-1) 33px),
      linear-gradient(135deg,var(--bg-raised),var(--bg-overlay));
      display:flex; align-items:center; justify-content:center; font-size:32px; }

    /* Right: recent */
    .history { flex:1; }
    .sec-title { font-size:18px; font-weight:700; margin-bottom:14px; }
    .trip-card { background:var(--bg-surface); border:1px solid var(--bd-1); border-radius:14px; padding:16px; margin-bottom:12px; }
    .trip-route { display:flex; align-items:center; gap:8px; font-size:14px; font-weight:600; margin-bottom:8px; }
    .trip-arrow { color:var(--tx-3); font-size:12px; }
    .trip-meta { display:flex; justify-content:space-between; align-items:center; font-size:12px; color:var(--tx-2); }
    .trip-price { font-size:16px; font-weight:800; color:var(--tx-1); }
    .trip-driver { font-size:11.5px; }
    .promo-card { border-radius:16px; padding:20px; background:linear-gradient(135deg,#34a853,#0f9d58); margin-top:20px; }
    .promo-title { font-size:16px; font-weight:700; color:#fff; margin-bottom:5px; }
    .promo-sub { font-size:13px; color:rgba(255,255,255,0.80); margin-bottom:14px; }
    .promo-code { display:inline-block; background:rgba(255,255,255,0.20); border-radius:8px; padding:8px 16px; color:#fff; font-size:15px; font-weight:800; letter-spacing:1px; }
  `;

  private _selected = 'com';

  override render() {
    const sel = RIDE_TYPES.find(r => r.id === this._selected)!;
    return html`<div class="layout">
      <div class="booking">
        <div class="map-mini">📍</div>
        <div class="booking-card">
          <div class="booking-title">Where to?</div>
          <div class="route-inputs">
            <div class="route-field">
              <div class="route-dot" style="background:#4285f4"></div>
              <input placeholder="Your location"/>
            </div>
            <div class="route-swap"><button class="swap-btn">⇅</button></div>
            <div class="route-field">
              <div class="route-dot" style="background:#ff5722"></div>
              <input placeholder="Enter destination"/>
            </div>
          </div>

          <div class="rides">
            ${RIDE_TYPES.map(r => html`
              <div class="ride-card ${this._selected===r.id?'selected':''}" @click=${()=>{this._selected=r.id;this.requestUpdate();}}>
                <div class="ride-icon">${r.icon}</div>
                <div class="ride-info">
                  <div class="ride-name">${r.name} <span style="font-size:11px;font-weight:400;color:var(--tx-2)">up to ${r.cap} riders</span>
                    ${r.badge ? html`<span class="ride-badge">${r.badge}</span>` : ''}</div>
                  <div class="ride-desc">${r.desc} · ${r.time} away</div>
                </div>
                <div>
                  <div class="ride-price">${r.price}</div>
                  <div class="ride-time">${r.time}</div>
                </div>
              </div>`)}
          </div>
          <button class="request-btn">Request ${sel.name}</button>
        </div>
      </div>

      <div class="history">
        <div class="sec-title">Recent Trips</div>
        ${RECENT.map(t => html`<div class="trip-card">
          <div class="trip-route">
            <span>${t.from}</span>
            <span class="trip-arrow">→</span>
            <span>${t.to}</span>
          </div>
          <div class="trip-meta">
            <div>
              <div class="trip-driver">${t.driver} · ★ ${t.rating}</div>
              <div style="font-size:11px;color:var(--tx-3);margin-top:2px">${t.date}</div>
            </div>
            <div class="trip-price">${t.price}</div>
          </div>
        </div>`)}

        <div class="promo-card">
          <div class="promo-title">🎁 Refer a friend</div>
          <div class="promo-sub">Share your code and get $15 off your next ride when they complete their first trip.</div>
          <div class="promo-code">YTUBE15</div>
        </div>
      </div>
    </div>`;
  }
}
if (!customElements.get('transport-page')) customElements.define('transport-page', TransportPage);
