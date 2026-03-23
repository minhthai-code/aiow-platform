import { LitElement, css, html } from 'lit';

const POSTS = [
  {
    id: 1, user: 'Alex Chen', initials: 'AC', color: '#4285f4',
    time: '2 minutes ago',
    text: 'Just shipped a new feature using Lit + TypeScript. The developer experience is incredible — reactive properties, no virtual DOM, and it works natively in browsers. 🔥',
    image: 'https://picsum.photos/seed/fb1/600/300',
    likes: 142, comments: 28, shares: 14, liked: true,
  },
  {
    id: 2, user: 'Sarah M.', initials: 'SM', color: '#ea4335',
    time: '15 minutes ago',
    text: 'Sunday morning hike views hit different ☀️ Nothing beats fresh air and beautiful scenery to reset your mind for the week ahead.',
    image: 'https://picsum.photos/seed/fb2/600/300',
    likes: 389, comments: 47, shares: 23, liked: false,
  },
  {
    id: 3, user: 'Marcus J.', initials: 'MJ', color: '#34a853',
    time: '1 hour ago',
    text: 'Reading "Deep Work" by Cal Newport. The concept of eliminating shallow tasks and focusing on cognitively demanding work is something every developer should practice.',
    image: null,
    likes: 67, comments: 12, shares: 5, liked: false,
  },
  {
    id: 4, user: 'Priya K.', initials: 'PK', color: '#9c27b0',
    time: '3 hours ago',
    text: 'Our team just crossed 1 million users! 🎉 Thank you to everyone who believed in what we were building. This is just the beginning.',
    image: 'https://picsum.photos/seed/fb4/600/300',
    likes: 1204, comments: 186, shares: 342, liked: true,
  },
];

const STORIES = [
  { user: 'Your Story', initials: '+', color: '#1877f2', hasStory: false },
  { user: 'Alex', initials: 'AC', color: '#4285f4', hasStory: true },
  { user: 'Sarah', initials: 'SM', color: '#ea4335', hasStory: true },
  { user: 'Marcus', initials: 'MJ', color: '#34a853', hasStory: true },
  { user: 'Priya', initials: 'PK', color: '#9c27b0', hasStory: true },
];

export class FbFeedPage extends LitElement {
  static override properties = { _liked: { type: Object, state: true } };

  static override styles = css`
    :host {
      display: block;
      min-height: 100%;
      background: var(--bg-base);
      color: var(--tx-1);
      font-family: var(--font, system-ui, sans-serif);
    }

    /* ── Layout ── */
    .layout {
      display: flex;
      gap: 0;
      max-width: 1100px;
      margin: 0 auto;
      padding: 20px 16px;
    }
    .feed-col {
      flex: 0 0 560px;
      max-width: 560px;
      margin: 0 auto;
    }

    /* ── Create post bar ── */
    .create-post {
      background: var(--bg-surface);
      border: 1px solid var(--bd-1);
      border-radius: 16px;
      padding: 14px 16px;
      margin-bottom: 16px;
    }
    .create-top {
      display: flex; align-items: center; gap: 10px;
      margin-bottom: 12px;
    }
    .avatar {
      width: 38px; height: 38px; border-radius: 50%; flex-shrink: 0;
      background: linear-gradient(135deg, #4285f4, #ff4081);
      display: flex; align-items: center; justify-content: center;
      font-size: 14px; font-weight: 700; color: #fff;
    }
    .create-input {
      flex: 1; padding: 9px 16px;
      border-radius: 999px;
      background: var(--bg-raised);
      border: 1px solid var(--bd-1);
      color: var(--tx-2); font-size: 14px; font-family: inherit;
      cursor: pointer;
      transition: background 100ms, border-color 100ms;
    }
    .create-input:hover { background: var(--bg-overlay); border-color: var(--bd-2); color: var(--tx-1); }
    .create-actions {
      display: flex; gap: 4px;
      border-top: 1px solid var(--bd-1);
      padding-top: 10px; margin-top: 2px;
    }
    .action-btn {
      flex: 1; display: flex; align-items: center; justify-content: center; gap: 6px;
      padding: 7px 4px; border-radius: 10px;
      border: none; background: none; cursor: pointer;
      color: var(--tx-2); font-size: 13px; font-weight: 600; font-family: inherit;
      transition: background 100ms ease, color 100ms ease;
    }
    .action-btn:hover { background: var(--bg-hover); color: var(--tx-1); }

    /* ── Stories ── */
    .stories {
      display: flex; gap: 10px;
      margin-bottom: 16px;
      overflow-x: auto; scrollbar-width: none;
      padding-bottom: 2px;
    }
    .stories::-webkit-scrollbar { display: none; }
    .story-card {
      flex-shrink: 0; width: 96px; height: 156px;
      border-radius: 14px; overflow: hidden;
      position: relative; cursor: pointer;
      background: var(--bg-raised);
      border: 1px solid var(--bd-1);
      transition: transform 120ms ease, box-shadow 120ms ease;
    }
    .story-card:hover { transform: scale(1.03); box-shadow: 0 8px 24px rgba(0,0,0,0.4); }
    .story-bg {
      position: absolute; inset: 0;
      background: linear-gradient(to bottom, transparent 30%, rgba(0,0,0,0.7) 100%);
    }
    .story-av {
      position: absolute; top: 10px; left: 50%; transform: translateX(-50%);
      width: 36px; height: 36px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-size: 14px; font-weight: 700; color: #fff;
      border: 3px solid #1877f2;
    }
    .story-av.add { border-color: var(--bg-surface); }
    .story-name {
      position: absolute; bottom: 10px; left: 0; right: 0;
      text-align: center; font-size: 11px; font-weight: 600;
      color: #fff; text-shadow: 0 1px 4px rgba(0,0,0,0.6);
    }
    .story-img {
      width: 100%; height: 100%; object-fit: cover; opacity: 0.7;
    }

    /* ── Post card ── */
    .post {
      background: var(--bg-surface);
      border: 1px solid var(--bd-1);
      border-radius: 16px;
      margin-bottom: 16px;
      overflow: hidden;
      transition: box-shadow 150ms ease;
    }
    .post:hover { box-shadow: 0 4px 24px rgba(0,0,0,0.25); }

    .post-header {
      display: flex; align-items: center; gap: 10px;
      padding: 14px 16px 10px;
    }
    .post-av {
      width: 40px; height: 40px; border-radius: 50%; flex-shrink: 0;
      display: flex; align-items: center; justify-content: center;
      font-size: 15px; font-weight: 700; color: #fff;
    }
    .post-user { font-size: 14px; font-weight: 700; color: var(--tx-1); }
    .post-time { font-size: 12px; color: var(--tx-3); margin-top: 1px; display: flex; align-items: center; gap: 3px; }
    .post-menu { margin-left: auto; }
    .menu-btn {
      width: 32px; height: 32px; border-radius: 50%;
      border: none; background: none; cursor: pointer;
      color: var(--tx-2); display: flex; align-items: center; justify-content: center;
      transition: background 100ms;
    }
    .menu-btn:hover { background: var(--bg-hover); }

    .post-text {
      padding: 0 16px 12px;
      font-size: 15px; line-height: 1.55; color: var(--tx-1);
    }

    .post-img { width: 100%; aspect-ratio: 16/8; object-fit: cover; display: block; }

    .post-stats {
      display: flex; align-items: center; justify-content: space-between;
      padding: 8px 16px;
      font-size: 13px; color: var(--tx-3);
      border-bottom: 1px solid var(--bd-1);
    }
    .stat-likes { display: flex; align-items: center; gap: 5px; }
    .like-dot {
      width: 18px; height: 18px; border-radius: 50%;
      background: #1877f2; display: flex; align-items: center; justify-content: center;
    }

    .post-actions {
      display: flex; padding: 4px 8px;
    }
    .react-btn {
      flex: 1; display: flex; align-items: center; justify-content: center; gap: 6px;
      padding: 8px 4px; border-radius: 10px;
      border: none; background: none; cursor: pointer;
      color: var(--tx-2); font-size: 13px; font-weight: 600; font-family: inherit;
      transition: background 100ms, color 100ms;
    }
    .react-btn:hover { background: var(--bg-hover); color: var(--tx-1); }
    .react-btn.liked { color: #1877f2; }
  `;

  private _liked: Record<number, boolean> = { 1: true, 4: true };

  private _toggleLike(id: number) {
    this._liked = { ...this._liked, [id]: !this._liked[id] };
  }

  override render() {
    return html`
      <div class="layout">
        <div class="feed-col">
          <!-- Stories -->
          <div class="stories">
            ${STORIES.map((s, i) => html`
              <div class="story-card">
                <img class="story-img" src="https://picsum.photos/seed/story${i}/200/300" alt=""/>
                <div class="story-bg"></div>
                <div class="story-av ${i === 0 ? 'add' : ''}" style="background:${s.color}">${s.initials}</div>
                <div class="story-name">${s.user}</div>
              </div>`)}
          </div>

          <!-- Create post -->
          <div class="create-post">
            <div class="create-top">
              <div class="avatar">U</div>
              <div class="create-input">What's on your mind?</div>
            </div>
            <div class="create-actions">
              <button class="action-btn">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="#f02849"><path d="M21 6.5l-4-4-8.5 8.5-2 5.5 5.5-2L21 6.5z"/></svg>
                Live video
              </button>
              <button class="action-btn">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="#45bd62"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>
                Photo/video
              </button>
              <button class="action-btn">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="#f7b928"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/></svg>
                Feeling/activity
              </button>
            </div>
          </div>

          <!-- Posts -->
          ${POSTS.map(post => html`
            <div class="post">
              <div class="post-header">
                <div class="post-av" style="background:${post.color}">${post.initials}</div>
                <div>
                  <div class="post-user">${post.user}</div>
                  <div class="post-time">
                    <svg viewBox="0 0 24 24" width="11" height="11" fill="currentColor"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm4.2 14.2L11 13V7h1.5v5.2l4.5 2.7-.8 1.3z"/></svg>
                    ${post.time}
                  </div>
                </div>
                <div class="post-menu">
                  <button class="menu-btn">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                      <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                    </svg>
                  </button>
                </div>
              </div>

              <div class="post-text">${post.text}</div>

              ${post.image ? html`<img class="post-img" src="${post.image}" alt="post image" loading="lazy"/>` : ''}

              <div class="post-stats">
                <div class="stat-likes">
                  <div class="like-dot">
                    <svg viewBox="0 0 24 24" width="11" height="11" fill="white"><path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"/></svg>
                  </div>
                  ${this._liked[post.id] ? post.likes : post.likes - (post.liked ? 1 : 0)} likes
                </div>
                <span>${post.comments} comments · ${post.shares} shares</span>
              </div>

              <div class="post-actions">
                <button class="react-btn ${this._liked[post.id] ? 'liked' : ''}"
                  @click=${() => this._toggleLike(post.id)}>
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="${this._liked[post.id] ? '#1877f2' : 'currentColor'}">
                    <path d="${this._liked[post.id]
                      ? 'M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z'
                      : 'M9 21h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2zM7 9l4.17-4.17.83 4.17H21v2l-3 7H9V9zM1 9h4v12H1V9z'}"/>
                  </svg>
                  Like
                </button>
                <button class="react-btn">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/></svg>
                  Comment
                </button>
                <button class="react-btn">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/></svg>
                  Share
                </button>
              </div>
            </div>`)}
        </div>
      </div>
    `;
  }
}

if (!customElements.get('fb-feed-page')) customElements.define('fb-feed-page', FbFeedPage);
