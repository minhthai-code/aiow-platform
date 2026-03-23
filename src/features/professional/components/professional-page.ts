import { LitElement, css, html } from 'lit';

const POSTS = [
  { id:1, user:'Sarah Chen', role:'Engineering Manager @ Google', av:'SC', color:'#4285f4', time:'2h', text:'Just published my article on "Building Resilient Distributed Systems at Scale". 3 years of lessons compressed into 12 minutes. Link in comments 👇', likes:847, comments:93 },
  { id:2, user:'Marcus Liu', role:'Founder & CEO @ Buildspace', av:'ML', color:'#0a66c2', time:'5h', text:'Hot take: The best engineers I\'ve hired had NO CS degree. What they had: obsessive curiosity, strong communication, and a portfolio that made me go "wait, they built this?"', likes:2341, comments:218 },
  { id:3, user:'Dr. Priya Singh', role:'AI Research Lead @ Anthropic', av:'PS', color:'#8a2be2', time:'1d', text:'Our latest paper on constitutional AI is now live on arXiv. TL;DR — we can train models to have consistent values without human feedback on every step. Game-changing for alignment.', likes:1204, comments:156 },
];

const JOBS = [
  { title:'Senior Frontend Engineer', company:'Stripe', location:'Remote', salary:'$200K–$280K', logo:'S', color:'#6772e5', badge:'Featured' },
  { title:'ML Engineer — LLMs', company:'Anthropic', location:'San Francisco', salary:'$250K–$350K', logo:'A', color:'#c65440', badge:'Hot' },
  { title:'Staff Product Designer', company:'Linear', location:'Remote', salary:'$180K–$240K', logo:'L', color:'#5e6ad2', badge:'' },
  { title:'DevRel Engineer', company:'Vercel', location:'Remote', salary:'$160K–$220K', logo:'V', color:'#000', badge:'New' },
];

const PEOPLE = [
  { name:'Alex Turner', role:'Staff SWE @ Meta', av:'AT', color:'#1877f2', mutual:12 },
  { name:'Jamie Park', role:'Product @ Notion', av:'JP', color:'#1c1c1c', mutual:8 },
  { name:'Nadia Patel', role:'VC @ a16z', av:'NP', color:'#0a66c2', mutual:21 },
];

export class ProfessionalPage extends LitElement {
  static override styles = css`
    :host { display:block; background:var(--bg-base); color:var(--tx-1); min-height:100%; font-family:-apple-system,BlinkMacSystemFont,'SF Pro Text',sans-serif; }
    .layout { display:flex; gap:24px; max-width:1200px; margin:0 auto; padding:24px 20px; }
    
    /* Profile sidebar */
    .profile-card {
      width:240px; flex-shrink:0;
      background:var(--bg-surface); border:1px solid var(--bd-1);
      border-radius:14px; overflow:hidden;
    }
    .profile-banner { height:72px; background:linear-gradient(135deg,#0a66c2,#0077b5); }
    .profile-body { padding:0 16px 16px; }
    .profile-av {
      width:68px; height:68px; border-radius:50%;
      background:linear-gradient(135deg,#4285f4,#9c27b0);
      border:3px solid var(--bg-surface);
      display:flex; align-items:center; justify-content:center;
      font-size:24px; font-weight:700; color:#fff;
      margin-top:-34px; margin-bottom:8px;
    }
    .profile-name { font-size:16px; font-weight:700; margin-bottom:2px; }
    .profile-role { font-size:12px; color:var(--tx-2); margin-bottom:10px; line-height:1.4; }
    .profile-stat { display:flex; justify-content:space-between; padding:10px 0; border-top:1px solid var(--bd-1); font-size:12px; color:var(--tx-2); }
    .stat-n { font-weight:700; color:var(--tx-1); }
    .prem-btn { width:100%; margin-top:10px; padding:8px; border-radius:8px; border:1px solid #0a66c2; background:none; color:#0a66c2; font-size:13px; font-weight:600; cursor:pointer; transition:background 100ms; }
    .prem-btn:hover { background:rgba(10,102,194,0.08); }

    /* Feed */
    .feed { flex:1; min-width:0; }
    
    /* Post */
    .post { background:var(--bg-surface); border:1px solid var(--bd-1); border-radius:14px; margin-bottom:14px; padding:16px; transition:box-shadow 150ms; }
    .post:hover { box-shadow:var(--shadow-md); }
    .post-head { display:flex; align-items:flex-start; gap:10px; margin-bottom:12px; }
    .av { width:42px; height:42px; border-radius:50%; flex-shrink:0; display:flex; align-items:center; justify-content:center; font-size:16px; font-weight:700; color:#fff; }
    .poster-name { font-size:14px; font-weight:600; }
    .poster-role { font-size:11.5px; color:var(--tx-2); margin-top:1px; }
    .post-time { font-size:11px; color:var(--tx-3); margin-top:1px; }
    .post-text { font-size:14px; line-height:1.6; color:var(--tx-1); margin-bottom:12px; }
    .post-actions { display:flex; gap:4px; padding-top:10px; border-top:1px solid var(--bd-1); }
    .pa-btn { flex:1; display:flex; align-items:center; justify-content:center; gap:5px; padding:7px; border-radius:8px; border:none; background:none; color:var(--tx-2); font-size:12.5px; font-weight:500; cursor:pointer; transition:background 100ms, color 100ms; font-family:inherit; }
    .pa-btn:hover { background:var(--bg-hover); color:var(--tx-1); }

    /* Right panel */
    .right { width:280px; flex-shrink:0; }
    .panel { background:var(--bg-surface); border:1px solid var(--bd-1); border-radius:14px; padding:16px; margin-bottom:14px; }
    .panel-title { font-size:14px; font-weight:700; margin-bottom:12px; }

    .job-card { padding:10px 0; border-bottom:1px solid var(--bd-1); }
    .job-card:last-child { border-bottom:none; padding-bottom:0; }
    .job-top { display:flex; align-items:flex-start; gap:10px; margin-bottom:4px; }
    .job-logo { width:36px; height:36px; border-radius:8px; flex-shrink:0; display:flex; align-items:center; justify-content:center; font-size:15px; font-weight:700; color:#fff; }
    .job-title { font-size:13px; font-weight:600; }
    .job-co { font-size:12px; color:var(--tx-2); }
    .job-meta { font-size:11px; color:var(--tx-3); margin-top:2px; }
    .job-badge { display:inline-block; font-size:10px; font-weight:700; padding:2px 7px; border-radius:4px; background:rgba(29,185,84,0.12); color:#1db954; margin-left:auto; flex-shrink:0; }

    .person-row { display:flex; align-items:center; gap:10px; padding:8px 0; border-bottom:1px solid var(--bd-1); }
    .person-row:last-child { border-bottom:none; }
    .person-av { width:38px; height:38px; border-radius:50%; flex-shrink:0; display:flex; align-items:center; justify-content:center; font-size:14px; font-weight:700; color:#fff; }
    .person-name { font-size:13px; font-weight:600; }
    .person-role { font-size:11px; color:var(--tx-2); }
    .connect-btn { margin-left:auto; padding:5px 14px; border-radius:999px; border:1.5px solid var(--tx-1); background:none; color:var(--tx-1); font-size:12px; font-weight:600; cursor:pointer; flex-shrink:0; transition:background 100ms, color 100ms; font-family:inherit; }
    .connect-btn:hover { background:var(--tx-1); color:var(--tx-inv); }
  `;

  override render() {
    return html`<div class="layout">
      <!-- Profile panel -->
      <div class="profile-card">
        <div class="profile-banner"></div>
        <div class="profile-body">
          <div class="profile-av">U</div>
          <div class="profile-name">User Name</div>
          <div class="profile-role">Senior Software Engineer · Building in public</div>
          <div class="profile-stat"><span>Profile views</span><span class="stat-n">1,842</span></div>
          <div class="profile-stat"><span>Connections</span><span class="stat-n">842</span></div>
          <div class="profile-stat"><span>Post impressions</span><span class="stat-n">28K</span></div>
          <button class="prem-btn">✦ Try Premium Free</button>
        </div>
      </div>

      <!-- Feed -->
      <div class="feed">
        ${POSTS.map(p => html`<div class="post">
          <div class="post-head">
            <div class="av" style="background:${p.color}">${p.av}</div>
            <div>
              <div class="poster-name">${p.user}</div>
              <div class="poster-role">${p.role}</div>
              <div class="post-time">${p.time} ago</div>
            </div>
          </div>
          <div class="post-text">${p.text}</div>
          <div style="font-size:12px;color:var(--tx-3);margin-bottom:8px">👍 ${p.likes.toLocaleString()} · ${p.comments} comments</div>
          <div class="post-actions">
            <button class="pa-btn"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"/></svg> Like</button>
            <button class="pa-btn"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg> Comment</button>
            <button class="pa-btn"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/></svg> Share</button>
            <button class="pa-btn"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5z"/></svg> Send</button>
          </div>
        </div>`)}
      </div>

      <!-- Right panel -->
      <div class="right">
        <div class="panel">
          <div class="panel-title">Jobs For You</div>
          ${JOBS.map(j => html`<div class="job-card">
            <div class="job-top">
              <div class="job-logo" style="background:${j.color}">${j.logo}</div>
              <div style="flex:1;min-width:0">
                <div class="job-title">${j.title}</div>
                <div class="job-co">${j.company} · ${j.location}</div>
                <div class="job-meta">${j.salary}</div>
              </div>
              ${j.badge ? html`<span class="job-badge">${j.badge}</span>` : ''}
            </div>
          </div>`)}
        </div>
        <div class="panel">
          <div class="panel-title">People You May Know</div>
          ${PEOPLE.map(p => html`<div class="person-row">
            <div class="person-av" style="background:${p.color}">${p.av}</div>
            <div>
              <div class="person-name">${p.name}</div>
              <div class="person-role">${p.role}</div>
              <div style="font-size:10px;color:var(--tx-3);margin-top:1px">${p.mutual} mutual connections</div>
            </div>
            <button class="connect-btn">+ Connect</button>
          </div>`)}
        </div>
      </div>
    </div>`;
  }
}
if (!customElements.get('professional-page')) customElements.define('professional-page', ProfessionalPage);
