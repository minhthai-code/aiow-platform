import { LitElement, css, html } from 'lit';

const COURSES = [
  { id:1, title:'Advanced TypeScript Patterns', instructor:'Matt Pocock', progress:68, duration:'12h 30m', students:'84K', rating:'4.9', thumb:'ts1', tag:'Dev', color:'#3178c6' },
  { id:2, title:'System Design for Senior Engineers', instructor:'Alex Xu', progress:34, duration:'18h', students:'112K', rating:'4.8', thumb:'sys1', tag:'Architecture', color:'#ff6b6b' },
  { id:3, title:'Machine Learning A-Z', instructor:'Kirill Eremenko', progress:12, duration:'44h', students:'956K', rating:'4.7', thumb:'ml1', tag:'AI/ML', color:'#f59e0b' },
  { id:4, title:'UI Design Fundamentals', instructor:'Gary Simon', progress:100, duration:'8h 20m', students:'203K', rating:'4.9', thumb:'ui1', tag:'Design', color:'#a855f7' },
];

const CATEGORIES = [
  { name:'Development', icon:'💻', count:'4,200+' },
  { name:'Design',      icon:'🎨', count:'1,800+' },
  { name:'Data Science',icon:'📊', count:'2,100+' },
  { name:'Business',    icon:'💼', count:'3,400+' },
  { name:'Marketing',   icon:'📢', count:'1,200+' },
  { name:'Photography', icon:'📷', count:'890+' },
];

const STATS = [{ n:'24', l:'Courses enrolled' }, { n:'8', l:'Completed' }, { n:'142h', l:'Total learning' }, { n:'3', l:'Certificates' }];

export class LearningPage extends LitElement {
  static override styles = css`
    :host { display:block; min-height:100%; background:var(--bg-base); color:var(--tx-1); font-family:-apple-system,BlinkMacSystemFont,'SF Pro Text',sans-serif; }
    .layout { max-width:1140px; margin:0 auto; padding:24px 20px; }

    /* Stats bar */
    .stats-row { display:flex; gap:12px; margin-bottom:28px; }
    .stat-card { flex:1; background:var(--bg-surface); border:1px solid var(--bd-1); border-radius:14px; padding:16px; text-align:center; }
    .stat-n { font-size:26px; font-weight:800; color:var(--tx-1); }
    .stat-l { font-size:12px; color:var(--tx-2); margin-top:2px; }

    /* Section */
    .sec-head { display:flex; align-items:center; justify-content:space-between; margin-bottom:14px; }
    .sec-title { font-size:18px; font-weight:700; }
    .see-all { font-size:13px; font-weight:600; color:var(--brand); background:none; border:none; cursor:pointer; font-family:inherit; }

    /* Course cards */
    .course-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(260px,1fr)); gap:16px; margin-bottom:32px; }
    .course-card { background:var(--bg-surface); border:1px solid var(--bd-1); border-radius:16px; overflow:hidden; cursor:pointer; transition:transform 150ms ease, box-shadow 150ms ease; }
    .course-card:hover { transform:translateY(-3px); box-shadow:var(--shadow-md); }
    .course-thumb { position:relative; padding-top:52%; background:var(--bg-raised); overflow:hidden; }
    .course-thumb img { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; }
    .course-tag { position:absolute; top:10px; left:10px; font-size:10.5px; font-weight:700; padding:3px 9px; border-radius:6px; color:#fff; }
    .course-body { padding:14px; }
    .course-title { font-size:14px; font-weight:700; margin-bottom:4px; line-height:1.35; display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden; }
    .course-instructor { font-size:12px; color:var(--tx-2); margin-bottom:10px; }
    .course-meta { display:flex; align-items:center; gap:10px; font-size:11.5px; color:var(--tx-3); }
    .rating { color:#f59e0b; font-weight:700; font-size:12px; }
    .progress-wrap { margin-top:10px; }
    .progress-label { display:flex; justify-content:space-between; font-size:11px; color:var(--tx-3); margin-bottom:5px; }
    .progress-bar { height:4px; background:var(--bd-1); border-radius:2px; overflow:hidden; }
    .progress-fill { height:100%; border-radius:2px; background:linear-gradient(90deg,#ff6b6b,#f59e0b); transition:width 800ms ease; }
    .progress-fill.done { background:#1db954; }

    /* Categories */
    .cat-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(160px,1fr)); gap:10px; margin-bottom:32px; }
    .cat-card { background:var(--bg-surface); border:1px solid var(--bd-1); border-radius:14px; padding:18px 14px; text-align:center; cursor:pointer; transition:background 120ms, transform 120ms; }
    .cat-card:hover { background:var(--bg-raised); transform:translateY(-2px); }
    .cat-icon { font-size:28px; margin-bottom:8px; }
    .cat-name { font-size:13px; font-weight:600; margin-bottom:3px; }
    .cat-count { font-size:11px; color:var(--tx-3); }

    /* Banner */
    .banner { border-radius:18px; padding:28px 32px; background:linear-gradient(135deg,#ff6b6b,#f59e0b); margin-bottom:28px; display:flex; align-items:center; gap:24px; }
    .banner-text { flex:1; }
    .banner-title { font-size:22px; font-weight:800; color:#fff; margin-bottom:6px; }
    .banner-sub   { font-size:14px; color:rgba(255,255,255,0.85); }
    .banner-btn { padding:11px 24px; border-radius:999px; border:none; background:#fff; color:#ff6b6b; font-size:14px; font-weight:700; cursor:pointer; flex-shrink:0; }
  `;

  override render() {
    return html`<div class="layout">
      <div class="stats-row">
        ${STATS.map(s => html`<div class="stat-card"><div class="stat-n">${s.n}</div><div class="stat-l">${s.l}</div></div>`)}
      </div>

      <div class="banner">
        <div class="banner-text">
          <div class="banner-title">🎓 Continue where you left off</div>
          <div class="banner-sub">Advanced TypeScript Patterns — 68% complete · Est. 4h remaining</div>
        </div>
        <button class="banner-btn">Resume →</button>
      </div>

      <div class="sec-head"><span class="sec-title">My Courses</span><button class="see-all">See all</button></div>
      <div class="course-grid">
        ${COURSES.map(c => html`
          <div class="course-card">
            <div class="course-thumb">
              <img src="https://picsum.photos/seed/${c.thumb}/400/210" alt="${c.title}" loading="lazy"/>
              <div class="course-tag" style="background:${c.color}">${c.tag}</div>
            </div>
            <div class="course-body">
              <div class="course-title">${c.title}</div>
              <div class="course-instructor">${c.instructor}</div>
              <div class="course-meta">
                <span class="rating">★ ${c.rating}</span>
                <span>·</span><span>${c.duration}</span>
                <span>·</span><span>${c.students} students</span>
              </div>
              <div class="progress-wrap">
                <div class="progress-label"><span>${c.progress === 100 ? '✓ Completed' : `${c.progress}% complete`}</span><span>${c.duration}</span></div>
                <div class="progress-bar"><div class="progress-fill ${c.progress===100?'done':''}" style="width:${c.progress}%"></div></div>
              </div>
            </div>
          </div>`)}
      </div>

      <div class="sec-head"><span class="sec-title">Browse Categories</span></div>
      <div class="cat-grid">
        ${CATEGORIES.map(c => html`
          <div class="cat-card">
            <div class="cat-icon">${c.icon}</div>
            <div class="cat-name">${c.name}</div>
            <div class="cat-count">${c.count} courses</div>
          </div>`)}
      </div>
    </div>`;
  }
}
if (!customElements.get('learning-page')) customElements.define('learning-page', LearningPage);
