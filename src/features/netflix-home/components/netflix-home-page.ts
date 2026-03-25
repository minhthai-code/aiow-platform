import { LitElement, css, html } from 'lit';

const HERO = { title:'Dune: Part Two', desc:'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.', rating:'PG-13', year:'2024', duration:'2h 46m', seed:'dune' };

const ROWS = [
  {
    label: 'Trending Now 🔥',
    items: [
      { id:1, title:'Dune: Part Two', seed:'dune', type:'Movie' },
      { id:2, title:'Oppenheimer', seed:'opp', type:'Movie' },
      { id:3, title:'The Bear', seed:'bear', type:'Series' },
      { id:4, title:'Poor Things', seed:'poor', type:'Movie' },
      { id:5, title:'Shogun', seed:'shogun', type:'Series' },
      { id:6, title:'Fallout', seed:'fall', type:'Series' },
      { id:7, title:'3 Body Problem', seed:'3body', type:'Series' },
    ],
  },
  {
    label: 'Popular Movies',
    items: [
      { id:1, title:'Past Lives', seed:'past', type:'Movie' },
      { id:2, title:'The Zone of Interest', seed:'zone', type:'Movie' },
      { id:3, title:'American Fiction', seed:'amfic', type:'Movie' },
      { id:4, title:'Anatomy of a Fall', seed:'anatomy', type:'Movie' },
      { id:5, title:'Priscilla', seed:'prisc', type:'Movie' },
      { id:6, title:'May December', seed:'may', type:'Movie' },
    ],
  },
  {
    label: 'Top TV Shows',
    items: [
      { id:1, title:'House of the Dragon', seed:'hotd', type:'Series' },
      { id:2, title:'The Last of Us', seed:'tlou', type:'Series' },
      { id:3, title:'Succession', seed:'succ', type:'Series' },
      { id:4, title:'Severance', seed:'sever', type:'Series' },
      { id:5, title:'The White Lotus', seed:'wlot', type:'Series' },
      { id:6, title:'Andor', seed:'andor', type:'Series' },
      { id:7, title:'Pachinko', seed:'pachi', type:'Series' },
    ],
  },
  {
    label: 'Recommended For You',
    items: [
      { id:1, title:'Inception', seed:'inc', type:'Movie' },
      { id:2, title:'Interstellar', seed:'inter', type:'Movie' },
      { id:3, title:'The Dark Knight', seed:'dark', type:'Movie' },
      { id:4, title:'Parasite', seed:'para', type:'Movie' },
      { id:5, title:'Knives Out', seed:'knives', type:'Movie' },
      { id:6, title:'Get Out', seed:'getout', type:'Movie' },
    ],
  },
];

export class NetflixHomePage extends LitElement {
  static override properties = { _hover: { type: String, state: true } };

  static override styles = css`
    :host {
      display: block;
      min-height: 100%;
      background: #141414;
      color: #fff;
      font-family: 'Netflix Sans', 'Helvetica Neue', system-ui, sans-serif;
    }

    /* ── Hero billboard ── */
    .hero {
      position: relative;
      height: 480px;
      overflow: hidden;
      margin-bottom: 8px;
    }
    .hero-img {
      position: absolute; inset: 0; width: 100%; height: 100%;
      object-fit: cover; opacity: 0.65;
    }
    .hero-grad {
      position: absolute; inset: 0;
      background:
        linear-gradient(to right, rgba(20,20,20,0.90) 0%, rgba(20,20,20,0.40) 50%, transparent 80%),
        linear-gradient(to top, rgba(20,20,20,0.95) 0%, transparent 40%);
    }
    .hero-content {
      position: absolute; bottom: 60px; left: 48px; max-width: 480px;
    }
    .hero-title {
      font-size: 54px; font-weight: 900;
      color: #fff; line-height: 1.05;
      letter-spacing: -1px; margin-bottom: 14px;
      text-shadow: 2px 2px 8px rgba(0,0,0,0.5);
    }
    .hero-meta {
      display: flex; align-items: center; gap: 10px;
      margin-bottom: 12px; font-size: 14px;
    }
    .hero-rating {
      border: 1.5px solid rgba(255,255,255,0.5);
      padding: 1px 6px; border-radius: 3px;
      font-size: 12px; font-weight: 700;
    }
    .hero-desc {
      font-size: 15px; line-height: 1.55;
      color: rgba(255,255,255,0.85);
      margin-bottom: 20px;
      display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;
    }
    .hero-btns { display: flex; gap: 10px; }
    .btn-play {
      display: flex; align-items: center; gap: 8px;
      padding: 11px 26px; border-radius: 6px;
      background: #fff; color: #000;
      font-size: 16px; font-weight: 700;
      border: none; cursor: pointer;
      transition: background 150ms ease;
    }
    .btn-play:hover { background: rgba(255,255,255,0.80); }
    .btn-info {
      display: flex; align-items: center; gap: 8px;
      padding: 11px 26px; border-radius: 6px;
      background: rgba(109,109,110,0.70);
      color: #fff; font-size: 16px; font-weight: 700;
      border: none; cursor: pointer; backdrop-filter: blur(4px);
      transition: background 150ms ease;
    }
    .btn-info:hover { background: rgba(109,109,110,0.50); }

    /* ── Content rows ── */
    .row { padding: 0 48px 32px; }
    .row-label {
      font-size: 18px; font-weight: 700; color: #e5e5e5;
      margin-bottom: 14px; letter-spacing: 0.1px;
    }

    .row-scroll {
      display: flex; gap: 6px;
      overflow-x: auto; scrollbar-width: none;
      padding-bottom: 8px;
    }
    .row-scroll::-webkit-scrollbar { display: none; }

    .card {
      flex-shrink: 0;
      width: 185px;
      border-radius: 6px; overflow: hidden;
      cursor: pointer; position: relative;
      transition: transform 250ms cubic-bezier(0.4,0,0.2,1), z-index 0ms 0ms;
    }
    .card:hover {
      transform: scale(1.08);
      z-index: 10;
      box-shadow: 0 20px 50px rgba(0,0,0,0.7);
    }

    .card-img {
      width: 100%; aspect-ratio: 16/10;
      object-fit: cover; display: block;
    }

    /* Info panel that slides up on hover */
    .card-info {
      position: absolute; bottom: 0; left: 0; right: 0;
      background: #181818; border-radius: 0 0 6px 6px;
      padding: 10px 12px 12px;
      transform: translateY(100%);
      transition: transform 250ms cubic-bezier(0.4,0,0.2,1);
    }
    .card:hover .card-info { transform: translateY(0); }

    .card-title { font-size: 13px; font-weight: 700; color: #fff; margin-bottom: 5px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .card-actions { display: flex; gap: 5px; margin-bottom: 7px; }
    .c-btn {
      width: 28px; height: 28px; border-radius: 50%;
      border: 1.5px solid rgba(255,255,255,0.45);
      background: none; cursor: pointer; color: #fff;
      display: flex; align-items: center; justify-content: center;
      transition: border-color 100ms, background 100ms;
    }
    .c-btn:hover { border-color: #fff; background: rgba(255,255,255,0.10); }
    .c-btn.play { background: #fff; color: #000; border-color: #fff; }
    .c-btn.play:hover { background: rgba(255,255,255,0.80); }
    .card-type { font-size: 11px; color: #46d369; font-weight: 600; }
  `;

  private _hover = '';

  override render() {
    return html`
      <!-- Hero -->
      <div class="hero">
        <img class="hero-img" src="https://picsum.photos/seed/${HERO.seed}/1400/500" alt="hero"/>
        <div class="hero-grad"></div>
        <div class="hero-content">
          <div class="hero-title">${HERO.title}</div>
          <div class="hero-meta">
            <span style="color:#46d369;font-weight:700">New</span>
            <span class="hero-rating">${HERO.rating}</span>
            <span>${HERO.year}</span>
            <span>${HERO.duration}</span>
          </div>
          <div class="hero-desc">${HERO.desc}</div>
          <div class="hero-btns">
            <button class="btn-play">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
              Play
            </button>
            <button class="btn-info">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
              More Info
            </button>
          </div>
        </div>
      </div>

      <!-- Content rows -->
      ${ROWS.map(row => html`
        <div class="row">
          <div class="row-label">${row.label}</div>
          <div class="row-scroll">
            ${row.items.map(item => html`
              <div class="card">
                <img class="card-img" src="https://picsum.photos/seed/${item.seed}/300/190" alt="${item.title}" loading="lazy"/>
                <div class="card-info">
                  <div class="card-title">${item.title}</div>
                  <div class="card-actions">
                    <button class="c-btn play">
                      <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                    </button>
                    <button class="c-btn">
                      <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
                    </button>
                    <button class="c-btn">
                      <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"/></svg>
                    </button>
                    <button class="c-btn" style="margin-left:auto">
                      <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"/></svg>
                    </button>
                  </div>
                  <div class="card-type">${item.type}</div>
                </div>
              </div>`)}
          </div>
        </div>`)}
    `;
  }
}

if (!customElements.get('netflix-home-page')) customElements.define('netflix-home-page', NetflixHomePage);
