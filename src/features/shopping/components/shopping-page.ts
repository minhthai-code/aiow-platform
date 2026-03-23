import { LitElement, css, html } from 'lit';

const FEATURED = [
  { id:1, name:'MacBook Pro M4 14"', price:'$1,999', orig:'$2,199', rating:'4.9', reviews:'2.1K', thumb:'mbp14', badge:'Best Seller', off:'9%' },
  { id:2, name:'Sony WH-1000XM6',    price:'$349',   orig:'$399',   rating:'4.8', reviews:'8.4K', thumb:'sonywh', badge:'Deal',        off:'13%' },
  { id:3, name:'iPad Air M2',        price:'$599',   orig:'$699',   rating:'4.7', reviews:'5.2K', thumb:'ipadair', badge:'',           off:'14%' },
  { id:4, name:'Apple Watch Series 10',price:'$399', orig:'$449',   rating:'4.8', reviews:'3.8K', thumb:'aw10',   badge:'New',         off:'11%' },
  { id:5, name:'Samsung 4K QLED 65"',price:'$1,299', orig:'$1,799', rating:'4.6', reviews:'1.4K', thumb:'samsung4k',badge:'Deal',      off:'28%' },
  { id:6, name:'Dyson V15 Detect',   price:'$699',   orig:'$799',   rating:'4.7', reviews:'6.7K', thumb:'dysonv15',badge:'',           off:'13%' },
];

const DEALS = [
  { label:'Lightning Deals', color:'#ff9900', items:['47% off AirPods Pro','31% off Kindle','22% off Echo'] },
  { label:'Coupons',         color:'#1db954', items:['Extra 15% off laptops','10% off phones','20% off tablets'] },
];

export class ShoppingPage extends LitElement {
  static override styles = css`
    :host { display:block; min-height:100%; background:var(--bg-base); color:var(--tx-1); font-family:-apple-system,BlinkMacSystemFont,'SF Pro Text',sans-serif; }
    .layout { max-width:1200px; margin:0 auto; padding:20px; }

    /* Hero banner */
    .hero { border-radius:20px; overflow:hidden; margin-bottom:24px; position:relative; height:200px; background:linear-gradient(135deg,#131921,#1a2535); display:flex; align-items:center; padding:0 40px; }
    .hero-text { z-index:1; }
    .hero-title { font-size:28px; font-weight:800; color:#fff; margin-bottom:6px; }
    .hero-sub { font-size:15px; color:rgba(255,255,255,0.70); margin-bottom:18px; }
    .hero-btn { padding:11px 28px; border-radius:10px; border:none; background:#ff9900; color:#131921; font-size:14px; font-weight:700; cursor:pointer; }
    .hero-img { position:absolute; right:40px; top:50%; transform:translateY(-50%); width:200px; height:160px; object-fit:cover; border-radius:12px; opacity:0.85; }

    /* Deal strips */
    .deal-strip { display:flex; gap:14px; margin-bottom:24px; }
    .deal-card { flex:1; background:var(--bg-surface); border:1px solid var(--bd-1); border-radius:14px; padding:16px; }
    .deal-title { font-size:14px; font-weight:700; margin-bottom:10px; display:flex; align-items:center; gap:6px; }
    .deal-dot { width:8px; height:8px; border-radius:50%; }
    .deal-item { font-size:12.5px; color:var(--tx-2); padding:4px 0; border-bottom:1px solid var(--bd-1); }
    .deal-item:last-child { border-bottom:none; }

    /* Product grid */
    .sec-head { display:flex; align-items:center; justify-content:space-between; margin-bottom:14px; }
    .sec-title { font-size:18px; font-weight:700; }
    .see-all { font-size:13px; font-weight:600; color:#ff9900; background:none; border:none; cursor:pointer; font-family:inherit; }

    .grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(190px,1fr)); gap:14px; }
    .product-card { background:var(--bg-surface); border:1px solid var(--bd-1); border-radius:14px; overflow:hidden; cursor:pointer; transition:transform 150ms, box-shadow 150ms; }
    .product-card:hover { transform:translateY(-3px); box-shadow:var(--shadow-md); }
    .product-img { position:relative; padding-top:100%; background:var(--bg-raised); }
    .product-img img { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; }
    .badge { position:absolute; top:8px; left:8px; font-size:10px; font-weight:700; padding:3px 8px; border-radius:5px; color:#fff; background:#ff9900; }
    .off-badge { position:absolute; top:8px; right:8px; font-size:10px; font-weight:700; padding:3px 7px; border-radius:5px; color:#fff; background:#e53935; }
    .product-body { padding:12px; }
    .product-name { font-size:13px; font-weight:500; line-height:1.35; margin-bottom:6px; display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden; }
    .rating-row { display:flex; align-items:center; gap:4px; font-size:11px; margin-bottom:6px; }
    .stars { color:#ff9900; }
    .price-row { display:flex; align-items:baseline; gap:6px; }
    .price { font-size:16px; font-weight:800; color:var(--tx-1); }
    .orig  { font-size:11.5px; color:var(--tx-3); text-decoration:line-through; }
    .add-btn { width:100%; margin-top:10px; padding:8px; border-radius:9px; border:1px solid var(--bd-1); background:var(--bg-raised); color:var(--tx-1); font-size:12.5px; font-weight:600; cursor:pointer; transition:background 100ms; font-family:inherit; }
    .add-btn:hover { background:var(--bg-overlay); }
  `;

  override render() {
    return html`<div class="layout">
      <div class="hero">
        <div class="hero-text">
          <div class="hero-title">Holiday Sale 🎉</div>
          <div class="hero-sub">Up to 40% off top tech brands. Today only.</div>
          <button class="hero-btn">Shop Now →</button>
        </div>
        <img class="hero-img" src="https://picsum.photos/seed/shopbanner/300/200" alt="sale"/>
      </div>

      <div class="deal-strip">
        ${DEALS.map(d => html`<div class="deal-card">
          <div class="deal-title"><div class="deal-dot" style="background:${d.color}"></div>${d.label}</div>
          ${d.items.map(i => html`<div class="deal-item">${i}</div>`)}
        </div>`)}
      </div>

      <div class="sec-head"><span class="sec-title">Best Sellers</span><button class="see-all">See all</button></div>
      <div class="grid">
        ${FEATURED.map(p => html`
          <div class="product-card">
            <div class="product-img">
              <img src="https://picsum.photos/seed/${p.thumb}/300/300" alt="${p.name}" loading="lazy"/>
              ${p.badge ? html`<span class="badge">${p.badge}</span>` : ''}
              ${p.off ? html`<span class="off-badge">-${p.off}</span>` : ''}
            </div>
            <div class="product-body">
              <div class="product-name">${p.name}</div>
              <div class="rating-row"><span class="stars">★★★★★</span><span style="color:var(--tx-2)">${p.rating} (${p.reviews})</span></div>
              <div class="price-row"><span class="price">${p.price}</span><span class="orig">${p.orig}</span></div>
              <button class="add-btn">+ Add to Cart</button>
            </div>
          </div>`)}
      </div>
    </div>`;
  }
}
if (!customElements.get('shopping-page')) customElements.define('shopping-page', ShoppingPage);
