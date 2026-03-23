import { LitElement, css, html } from 'lit';

const LISTINGS = [
  { id:1, title:'2021 MacBook Pro 16" M1 Max — Excellent',  price:'$1,800', loc:'San Francisco, CA', img:'mbl1', time:'2h ago',  tag:'Electronics' },
  { id:2, title:'Mid-Century Modern Walnut Desk',            price:'$450',   loc:'Brooklyn, NY',     img:'desk1', time:'4h ago', tag:'Furniture' },
  { id:3, title:'Road Bike Trek Domane SL 5 — Size 54cm',   price:'$2,200', loc:'Austin, TX',       img:'bike1', time:'1d ago', tag:'Sports' },
  { id:4, title:'iPhone 15 Pro Max 256GB Natural Titanium',  price:'$950',   loc:'Chicago, IL',      img:'iph15', time:'3h ago', tag:'Electronics' },
  { id:5, title:'Vintage Leica M6 35mm Film Camera',         price:'$3,400', loc:'New York, NY',     img:'leica1', time:'2d ago',tag:'Cameras' },
  { id:6, title:'Standing Desk Motorized — Uplift 72"',      price:'$700',   loc:'Seattle, WA',      img:'std1', time:'5h ago',  tag:'Furniture' },
];

export class MarketplacePage extends LitElement {
  static override styles = css`
    :host { display:block; min-height:100%; background:var(--bg-base); color:var(--tx-1); font-family:-apple-system,BlinkMacSystemFont,'SF Pro Text',sans-serif; }
    .layout { display:flex; gap:20px; max-width:1200px; margin:0 auto; padding:20px; }

    /* Filters sidebar */
    .filters { width:230px; flex-shrink:0; }
    .filter-card { background:var(--bg-surface); border:1px solid var(--bd-1); border-radius:14px; padding:16px; margin-bottom:12px; }
    .filter-title { font-size:14px; font-weight:700; margin-bottom:12px; }
    .price-row { display:flex; gap:8px; align-items:center; }
    .price-input { flex:1; padding:7px 10px; border-radius:8px; border:1px solid var(--bd-1); background:var(--bg-raised); color:var(--tx-1); font-size:13px; font-family:inherit; outline:none; }
    .filter-label { display:flex; align-items:center; gap:8px; padding:5px 0; font-size:13px; color:var(--tx-1); cursor:pointer; }
    input[type=checkbox] { accent-color:var(--brand); }
    .apply-btn { width:100%; padding:9px; border-radius:10px; border:none; background:var(--brand); color:#fff; font-size:13px; font-weight:600; cursor:pointer; font-family:inherit; margin-top:4px; }

    /* Main */
    .main { flex:1; min-width:0; }
    .main-head { display:flex; align-items:center; gap:10px; margin-bottom:18px; }
    .search-box { flex:1; display:flex; align-items:center; background:var(--bg-surface); border:1.5px solid var(--bd-1); border-radius:12px; padding:0 14px; height:42px; gap:8px; }
    .search-box input { flex:1; border:none; background:none; color:var(--tx-1); font-size:14px; font-family:inherit; outline:none; }
    .sort-btn { padding:0 14px; height:42px; border-radius:12px; border:1px solid var(--bd-1); background:var(--bg-surface); color:var(--tx-2); font-size:13px; font-family:inherit; cursor:pointer; }

    .grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(240px,1fr)); gap:14px; }
    .card { background:var(--bg-surface); border:1px solid var(--bd-1); border-radius:14px; overflow:hidden; cursor:pointer; transition:transform 150ms, box-shadow 150ms; }
    .card:hover { transform:translateY(-3px); box-shadow:var(--shadow-md); }
    .thumb { padding-top:66%; position:relative; background:var(--bg-raised); }
    .thumb img { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; }
    .tag { position:absolute; top:8px; left:8px; font-size:10px; font-weight:700; padding:3px 8px; border-radius:5px; background:rgba(0,0,0,0.65); color:#fff; backdrop-filter:blur(4px); }
    .body { padding:12px 14px; }
    .listing-title { font-size:13.5px; font-weight:600; margin-bottom:4px; display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden; line-height:1.35; }
    .price { font-size:18px; font-weight:800; color:var(--tx-1); margin-bottom:4px; }
    .meta  { font-size:11.5px; color:var(--tx-3); display:flex; gap:8px; }
    .save-btn { margin-top:10px; width:100%; padding:7px; border-radius:8px; border:1px solid var(--bd-1); background:none; color:var(--tx-2); font-size:12px; font-weight:500; cursor:pointer; font-family:inherit; transition:background 100ms, color 100ms; }
    .save-btn:hover { background:var(--bg-hover); color:var(--tx-1); }
  `;

  override render() {
    return html`<div class="layout">
      <div class="filters">
        <div class="filter-card">
          <div class="filter-title">Price Range</div>
          <div class="price-row"><input class="price-input" placeholder="Min"/><span style="color:var(--tx-3)">–</span><input class="price-input" placeholder="Max"/></div>
        </div>
        <div class="filter-card">
          <div class="filter-title">Category</div>
          ${['Electronics','Furniture','Vehicles','Sports','Clothing','Free items'].map(c => html`
            <label class="filter-label"><input type="checkbox"/>${c}</label>`)}
        </div>
        <div class="filter-card">
          <div class="filter-title">Condition</div>
          ${['New','Like New','Good','Fair'].map(c => html`
            <label class="filter-label"><input type="checkbox" .checked=${c==='Like New'||c==='New'}/>${c}</label>`)}
          <button class="apply-btn">Apply Filters</button>
        </div>
      </div>

      <div class="main">
        <div class="main-head">
          <div class="search-box">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="var(--tx-3)"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
            <input placeholder="Search listings…"/>
          </div>
          <select class="sort-btn"><option>Newest first</option><option>Price: Low–High</option><option>Price: High–Low</option></select>
        </div>
        <div class="grid">
          ${LISTINGS.map(l => html`
            <div class="card">
              <div class="thumb"><img src="https://picsum.photos/seed/${l.img}/400/260" alt="${l.title}" loading="lazy"/><span class="tag">${l.tag}</span></div>
              <div class="body">
                <div class="listing-title">${l.title}</div>
                <div class="price">${l.price}</div>
                <div class="meta"><span>${l.loc}</span><span>·</span><span>${l.time}</span></div>
                <button class="save-btn">♡ Save</button>
              </div>
            </div>`)}
        </div>
      </div>
    </div>`;
  }
}
if (!customElements.get('marketplace-page')) customElements.define('marketplace-page', MarketplacePage);
