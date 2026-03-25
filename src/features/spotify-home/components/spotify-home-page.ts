import { LitElement, css, html } from 'lit';

const RECENTLY_PLAYED = [
  { id:1, name:'Blinding Lights', artist:'The Weeknd', color:'#1db954', seed:'sp1' },
  { id:2, name:'Chill Vibes Mix', artist:'Playlist · 32 songs', color:'#e91e63', seed:'sp2' },
  { id:3, name:'After Hours', artist:'The Weeknd', color:'#7c4dff', seed:'sp3' },
  { id:4, name:'Late Night Drive', artist:'Playlist · 18 songs', color:'#ff5722', seed:'sp4' },
  { id:5, name:'Starboy', artist:'The Weeknd', color:'#2196f3', seed:'sp5' },
  { id:6, name:'Focus Mode', artist:'Playlist · 27 songs', color:'#ff9800', seed:'sp6' },
];

const FEATURED = [
  { id:1, name:'Good Morning', desc:'Start your day right', gradient:'linear-gradient(135deg,#1db954,#005f2e)', seed:'feat1' },
  { id:2, name:'Top Hits 2024', desc:'The biggest songs right now', gradient:'linear-gradient(135deg,#e91e63,#880037)', seed:'feat2' },
  { id:3, name:'Chill Out', desc:'Relax and unwind', gradient:'linear-gradient(135deg,#2196f3,#0d47a1)', seed:'feat3' },
  { id:4, name:'Workout Boost', desc:'High energy gym mix', gradient:'linear-gradient(135deg,#ff5722,#bf360c)', seed:'feat4' },
];

const NEW_RELEASES = [
  { id:1, name:'Chromakopia', artist:'Tyler, the Creator', seed:'nr1', type:'Album' },
  { id:2, name:'Short n\' Sweet', artist:'Sabrina Carpenter', seed:'nr2', type:'Album' },
  { id:3, name:'Hit Me Hard', artist:'Billie Eilish', seed:'nr3', type:'Album' },
  { id:4, name:'Bright Future', artist:'Adrianne Lenker', seed:'nr4', type:'Album' },
  { id:5, name:'Manning Fireworks', artist:'MJ Lenderman', seed:'nr5', type:'Album' },
];

const RECOMMENDED = [
  { id:1, name:'Midnight Rain', artist:'Taylor Swift', seed:'rec1' },
  { id:2, name:'As It Was', artist:'Harry Styles', seed:'rec2' },
  { id:3, name:'Stay', artist:'The Kid LAROI', seed:'rec3' },
  { id:4, name:'Heat Waves', artist:'Glass Animals', seed:'rec4' },
  { id:5, name:'Levitating', artist:'Dua Lipa', seed:'rec5' },
  { id:6, name:'Peaches', artist:'Justin Bieber', seed:'rec6' },
];

export class SpotifyHomePage extends LitElement {
  static override properties = { _playing: { type: Number, state: true } };

  static override styles = css`
    :host {
      display: block;
      min-height: 100%;
      background: #121212;
      color: #fff;
      font-family: 'Circular', 'DM Sans', system-ui, sans-serif;
      overflow-x: hidden;
    }

    /* ── Hero gradient ── */
    .hero {
      padding: 32px 28px 20px;
      background: linear-gradient(180deg, rgba(29,185,84,0.3) 0%, transparent 100%);
    }
    .greeting { font-size: 28px; font-weight: 800; color: #fff; margin-bottom: 20px; }

    /* ── Quick play grid ── */
    .quick-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      gap: 8px;
      margin-bottom: 36px;
    }
    .quick-card {
      display: flex; align-items: center; gap: 0;
      background: rgba(255,255,255,0.08);
      border-radius: 6px; overflow: hidden;
      cursor: pointer; height: 56px;
      transition: background 150ms ease;
      position: relative;
    }
    .quick-card:hover { background: rgba(255,255,255,0.14); }
    .quick-card:hover .q-play { opacity: 1; transform: scale(1) translateY(-50%); }
    .quick-img { width: 56px; height: 56px; object-fit: cover; flex-shrink: 0; }
    .quick-name { flex: 1; padding: 0 14px; font-size: 13px; font-weight: 700; color: #fff; }
    .q-play {
      position: absolute; right: 10px; top: 50%; transform: scale(0.8) translateY(-50%);
      width: 40px; height: 40px; border-radius: 50%;
      background: #1db954; border: none; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      opacity: 0; box-shadow: 0 4px 12px rgba(0,0,0,0.4);
      transition: opacity 150ms ease, transform 200ms cubic-bezier(0.34,1.56,0.64,1);
    }

    /* ── Section ── */
    .section { padding: 0 28px 32px; }
    .section-header {
      display: flex; align-items: center; justify-content: space-between;
      margin-bottom: 18px;
    }
    .section-title { font-size: 20px; font-weight: 800; color: #fff; }
    .see-all {
      font-size: 12px; font-weight: 700; color: #a7a7a7; letter-spacing: 0.5px;
      text-transform: uppercase; background: none; border: none; cursor: pointer;
      transition: color 100ms;
    }
    .see-all:hover { color: #fff; }

    /* ── Card grid ── */
    .card-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
      gap: 20px;
    }
    .album-card {
      background: #181818; border-radius: 10px; padding: 14px;
      cursor: pointer; position: relative;
      transition: background 200ms ease;
    }
    .album-card:hover { background: #282828; }
    .album-card:hover .play-overlay { opacity: 1; transform: translateY(0) scale(1); }

    .album-img {
      width: 100%; aspect-ratio: 1; object-fit: cover;
      border-radius: 6px; display: block; margin-bottom: 12px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.5);
    }
    .album-name { font-size: 14px; font-weight: 700; color: #fff; margin-bottom: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .album-sub  { font-size: 12px; color: #a7a7a7; line-height: 1.4; }

    .play-overlay {
      position: absolute; bottom: 72px; right: 14px;
      width: 44px; height: 44px; border-radius: 50%;
      background: #1db954; border: none; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      opacity: 0; transform: translateY(8px) scale(0.9);
      box-shadow: 0 8px 20px rgba(0,0,0,0.4);
      transition: opacity 200ms ease, transform 200ms cubic-bezier(0.34,1.56,0.64,1);
    }

    /* ── Featured row ── */
    .featured-grid {
      display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px;
    }
    .featured-card {
      border-radius: 14px; overflow: hidden;
      cursor: pointer; position: relative; height: 180px;
      transition: transform 150ms ease, box-shadow 150ms ease;
    }
    .featured-card:hover { transform: scale(1.02); box-shadow: 0 16px 40px rgba(0,0,0,0.5); }
    .featured-img {
      position: absolute; inset: 0; width: 100%; height: 100%;
      object-fit: cover; opacity: 0.55;
    }
    .featured-info {
      position: absolute; bottom: 0; left: 0; right: 0;
      padding: 16px; background: linear-gradient(transparent, rgba(0,0,0,0.7));
    }
    .featured-name { font-size: 17px; font-weight: 800; color: #fff; margin-bottom: 3px; }
    .featured-desc { font-size: 12px; color: rgba(255,255,255,0.72); }

    /* ── Horizontal row ── */
    .h-row {
      display: flex; gap: 16px;
      overflow-x: auto; scrollbar-width: none;
      padding-bottom: 4px;
    }
    .h-row::-webkit-scrollbar { display: none; }
    .track-card {
      flex-shrink: 0; width: 155px; padding: 12px;
      background: #181818; border-radius: 10px; cursor: pointer;
      transition: background 150ms ease;
    }
    .track-card:hover { background: #282828; }
    .track-img {
      width: 100%; aspect-ratio: 1; object-fit: cover;
      border-radius: 6px; display: block; margin-bottom: 10px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.4);
    }
    .track-name { font-size: 13px; font-weight: 700; color: #fff; margin-bottom: 3px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .track-art  { font-size: 11px; color: #a7a7a7; }
  `;

  private _playing = -1;

  override render() {
    const hr = new Date().getHours();
    const greeting = hr < 12 ? 'Good morning' : hr < 18 ? 'Good afternoon' : 'Good evening';
    return html`
      <!-- Hero -->
      <div class="hero">
        <div class="greeting">${greeting}</div>
        <div class="quick-grid">
          ${RECENTLY_PLAYED.slice(0, 6).map((item, i) => html`
            <div class="quick-card" @click=${() => { this._playing = i; }}>
              <img class="quick-img" src="https://picsum.photos/seed/${item.seed}/56/56" alt=""/>
              <span class="quick-name">${item.name}</span>
              <button class="q-play">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="black"><path d="M8 5v14l11-7z"/></svg>
              </button>
            </div>`)}
        </div>
      </div>

      <!-- Featured -->
      <div class="section">
        <div class="section-header">
          <span class="section-title">Featured playlists</span>
          <button class="see-all">Show all</button>
        </div>
        <div class="featured-grid">
          ${FEATURED.map(f => html`
            <div class="featured-card" style="background:${f.gradient}">
              <img class="featured-img" src="https://picsum.photos/seed/${f.seed}/400/200" alt=""/>
              <div class="featured-info">
                <div class="featured-name">${f.name}</div>
                <div class="featured-desc">${f.desc}</div>
              </div>
            </div>`)}
        </div>
      </div>

      <!-- New Releases -->
      <div class="section">
        <div class="section-header">
          <span class="section-title">New releases</span>
          <button class="see-all">Show all</button>
        </div>
        <div class="card-grid">
          ${NEW_RELEASES.map(item => html`
            <div class="album-card">
              <img class="album-img" src="https://picsum.photos/seed/${item.seed}/200/200" alt=""/>
              <button class="play-overlay">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="black"><path d="M8 5v14l11-7z"/></svg>
              </button>
              <div class="album-name">${item.name}</div>
              <div class="album-sub">${item.type} · ${item.artist}</div>
            </div>`)}
        </div>
      </div>

      <!-- Recommended -->
      <div class="section">
        <div class="section-header">
          <span class="section-title">Recommended for you</span>
          <button class="see-all">Show all</button>
        </div>
        <div class="h-row">
          ${RECOMMENDED.map(t => html`
            <div class="track-card">
              <img class="track-img" src="https://picsum.photos/seed/${t.seed}/200/200" alt=""/>
              <div class="track-name">${t.name}</div>
              <div class="track-art">${t.artist}</div>
            </div>`)}
        </div>
      </div>
    `;
  }
}

if (!customElements.get('spotify-home-page')) customElements.define('spotify-home-page', SpotifyHomePage);
