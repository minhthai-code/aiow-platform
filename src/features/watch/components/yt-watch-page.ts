import { LitElement, html, css } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import type { WatchStore, WatchState } from '../state/watch-store';
import type { Video, Comment } from '@core/types';
import { avatarColor } from '@libs/utils/mock-data';
import { getRegisteredService } from '@core/runtime-api/platform-element';
import type { NavigationController } from '@core/router/router';

export class YtWatchPage extends LitElement {
  static override properties = { store: { type: Object, attribute: false }, _st: { type: Object, state: true } };

  static override styles = css`
    :host { display: block; }

    .layout {
      display: flex;
      gap: 28px;
      padding: 20px 24px 48px;
      max-width: 1680px;
      margin: 0 auto;
    }
    .main  { flex: 1; min-width: 0; }
    .aside { width: 380px; flex-shrink: 0; }

    @media (max-width: 1200px) { .aside { width: 320px; } }
    @media (max-width: 960px)  { .layout { flex-direction: column; } .aside { width: 100%; } }
    @media (max-width: 640px)  { .layout { padding: 0 0 48px; } }

    /* ── Player ── */
    .player-wrap {
      width: 100%;
      aspect-ratio: 16 / 9;
      background: #000;
      border-radius: var(--r-xl, 16px);
      overflow: hidden;
      position: relative;
      margin-bottom: 16px;
    }
    @media (max-width: 640px) { .player-wrap { border-radius: 0; } }

    .player-inner {
      position: absolute; inset: 0;
      display: flex; align-items: center; justify-content: center;
      cursor: pointer;
    }
    .player-thumb {
      position: absolute; inset: 0;
      width: 100%; height: 100%;
      object-fit: cover;
      filter: brightness(0.7);
    }
    .play-btn {
      position: relative; z-index: 1;
      width: 72px; height: 72px; border-radius: 50%;
      background: rgba(255,255,255,0.95);
      display: flex; align-items: center; justify-content: center;
      border: none; cursor: pointer;
      transition: transform 140ms ease, background 140ms ease;
      box-shadow: 0 4px 24px rgba(0,0,0,0.5);
    }
    .play-btn:hover { transform: scale(1.08); background: #fff; }

    /* ── Title ── */
    h1 {
      font-size: 18px;
      font-weight: 600;
      line-height: 1.4;
      color: var(--tx-1);
      margin-bottom: 14px;
    }

    /* ── Actions row — NO divider below ── */
    .actions {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
      margin-bottom: 20px;
    }
    .spacer { flex: 1; }

    .action-btn {
      display: flex; align-items: center; gap: 6px;
      height: 36px; padding: 0 14px;
      border-radius: var(--r-full, 999px);
      background: var(--bg-raised);
      border: 1px solid var(--bd-1);
      color: var(--tx-2);
      font-size: 13px; font-weight: 500; font-family: inherit;
      cursor: pointer;
      transition: background 80ms ease, color 80ms ease, border-color 80ms ease;
    }
    .action-btn:hover {
      background: var(--bg-hover);
      color: var(--tx-1);
      border-color: var(--bd-2);
    }

    .like-group {
      display: flex;
      background: var(--bg-raised);
      border: 1px solid var(--bd-1);
      border-radius: var(--r-full, 999px);
      overflow: hidden;
      transition: border-color 80ms ease;
    }
    .like-group:hover { border-color: var(--bd-2); }

    .like-group button {
      height: 36px; padding: 0 14px;
      display: flex; align-items: center; gap: 6px;
      border: none; cursor: pointer;
      color: var(--tx-2);
      font-size: 13px; font-weight: 500; font-family: inherit;
      background: none;
      transition: background 80ms ease, color 80ms ease;
    }
    .like-group button:hover { background: var(--bg-hover); color: var(--tx-1); }
    .like-group button.liked { color: var(--tx-1); }

    /* Thin separator inside like group — not a full divider */
    .like-sep {
      width: 1px;
      margin: 8px 0;
      background: var(--bd-1);
      flex-shrink: 0;
    }

    /* ── Channel row — NO border dividers ── */
    .channel-row {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px 0;
    }
    .ch-av {
      width: 42px; height: 42px; border-radius: 50%;
      flex-shrink: 0;
      display: flex; align-items: center; justify-content: center;
      font-size: 16px; font-weight: 600; color: #fff;
      cursor: pointer;
      transition: opacity 80ms ease;
    }
    .ch-av:hover { opacity: 0.85; }
    .ch-info { flex: 1; }
    .ch-name {
      font-size: 15px; font-weight: 600;
      color: var(--tx-1);
      cursor: pointer;
      transition: color 80ms ease;
    }
    .ch-name:hover { color: var(--tx-2); }
    .ch-subs { font-size: 12px; color: var(--tx-3); margin-top: 2px; }

    .sub-btn {
      height: 36px; padding: 0 18px;
      border-radius: var(--r-full, 999px);
      background: var(--tx-1);
      color: var(--tx-inv);
      font-size: 13px; font-weight: 600; font-family: inherit;
      border: none; cursor: pointer;
      transition: opacity 80ms ease;
    }
    .sub-btn:hover { opacity: 0.88; }
    .sub-btn.subbed {
      background: var(--bg-raised);
      color: var(--tx-2);
      border: 1px solid var(--bd-1);
    }

    /* ── Description box ── */
    .desc-box {
      background: var(--bg-surface);
      border-radius: var(--r-xl, 16px);
      padding: 14px 16px;
      cursor: pointer;
      margin-bottom: 28px;
      transition: background 80ms ease;
    }
    .desc-box:hover { background: var(--bg-raised); }
    .desc-stats { font-size: 13px; font-weight: 600; margin-bottom: 8px; color: var(--tx-1); }
    .desc-text { font-size: 14px; line-height: 1.65; white-space: pre-line; color: var(--tx-1); }
    .desc-text.clamp { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
    .desc-more { font-size: 13px; font-weight: 600; margin-top: 8px; color: var(--tx-2); }

    /* ── Comments ── */
    .comments { margin-top: 4px; }
    .c-head { font-size: 17px; font-weight: 600; margin-bottom: 20px; }

    .c-input-row { display: flex; gap: 12px; align-items: flex-start; margin-bottom: 28px; }
    .c-av-sm {
      width: 36px; height: 36px; border-radius: 50%; flex-shrink: 0;
      background: linear-gradient(135deg,#4285f4,#ff4081);
      display: flex; align-items: center; justify-content: center;
      color: #fff; font-size: 13px; font-weight: 600;
    }
    .c-input {
      flex: 1; height: 40px; font-size: 14px; font-family: inherit;
      background: transparent; border: none;
      border-bottom: 1.5px solid var(--bd-2);
      color: var(--tx-1); outline: none;
      transition: border-color 80ms ease;
    }
    .c-input:focus { border-bottom-color: var(--bd-3); }
    .c-input::placeholder { color: var(--tx-3); }

    .comment { display: flex; gap: 12px; margin-bottom: 22px; }
    .c-av    { width: 36px; height: 36px; border-radius: 50%; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 600; color: #fff; }
    .c-body  { flex: 1; }
    .c-meta  { display: flex; align-items: baseline; gap: 8px; margin-bottom: 5px; }
    .c-name  { font-size: 13px; font-weight: 600; color: var(--tx-1); }
    .c-ago   { font-size: 12px; color: var(--tx-3); }
    .c-pinned { font-size: 11px; color: var(--tx-3); display: flex; align-items: center; gap: 3px; }
    .c-text  { font-size: 14px; line-height: 1.55; color: var(--tx-1); }
    .c-acts  { display: flex; align-items: center; gap: 2px; margin-top: 8px; }
    .c-act   {
      display: flex; align-items: center; gap: 4px;
      font-size: 12px; color: var(--tx-3);
      cursor: pointer; padding: 4px 8px;
      border-radius: var(--r-md, 8px); border: none;
      background: none; font-family: inherit;
      transition: color 80ms ease, background 80ms ease;
    }
    .c-act:hover { color: var(--tx-1); background: var(--bg-hover); }

    /* ── Recommendations ── */
    .rec {
      display: flex; gap: 10px;
      margin-bottom: 12px; cursor: pointer;
      border-radius: var(--r-xl, 16px);
      padding: 6px;
      transition: background 80ms ease;
    }
    .rec:hover { background: var(--bg-hover); }
    .rec-thumb {
      width: 160px; flex-shrink: 0;
      position: relative;
      border-radius: var(--r-lg, 12px);
      overflow: hidden;
      background: var(--bg-raised);
      aspect-ratio: 16/9;
    }
    .rec-thumb img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 200ms ease; }
    
    .rec-dur { position: absolute; bottom: 5px; right: 5px; background: rgba(0,0,0,.88); color: #fff; font-size: 11px; font-weight: 600; padding: 1px 5px; border-radius: 3px; }
    .rec-meta { flex: 1; min-width: 0; padding-top: 2px; }
    .rec-title { font-size: 13px; font-weight: 500; line-height: 1.35; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; color: var(--tx-1); margin-bottom: 5px; }
    .rec-ch    { font-size: 12px; color: var(--tx-2); margin-bottom: 2px; }
    .rec-stats { font-size: 12px; color: var(--tx-3); }

    /* ── Skeleton ── */
    .sk { border-radius: 4px; background: linear-gradient(90deg,var(--bg-raised) 25%,var(--bg-overlay) 50%,var(--bg-raised) 75%); background-size: 200% 100%; animation: sh 1.8s ease infinite; }
    @keyframes sh { 0%{background-position:200% 0}100%{background-position:-200% 0} }
  `;

  store!: WatchStore;
  private _st!: WatchState;
  private _unsub?: () => void;

  override connectedCallback(): void {
    super.connectedCallback();
    this._st = this.store.getState();
    this._unsub = this.store.subscribe(s => { this._st = s; this.requestUpdate(); });
  }
  override disconnectedCallback(): void { super.disconnectedCallback(); this._unsub?.(); }

  private _nav(p: string): void { getRegisteredService<NavigationController>('Router').push(p); }

  private _loading() {
    return html`
      <div class="layout">
        <div class="main">
          <div class="sk" style="width:100%;aspect-ratio:16/9;border-radius:16px;margin-bottom:16px"></div>
          <div class="sk" style="height:22px;width:80%;margin-bottom:10px"></div>
          <div class="sk" style="height:16px;width:45%"></div>
        </div>
        <div class="aside">
          ${Array.from({length:8}).map(()=>html`
            <div class="rec" style="cursor:default;padding:6px">
              <div class="sk" style="width:160px;aspect-ratio:16/9;border-radius:12px;flex-shrink:0"></div>
              <div style="flex:1;display:flex;flex-direction:column;gap:7px;padding-top:4px">
                <div class="sk" style="height:13px;width:90%"></div>
                <div class="sk" style="height:11px;width:60%"></div>
              </div>
            </div>`)}
        </div>
      </div>`;
  }

  override render() {
    const st = this._st;
    if (!st)        return html``;
    if (st.loading) return this._loading();
    if (st.error)   return html`<div style="padding:48px;text-align:center;color:var(--tx-2)"><h2 style="color:var(--tx-1)">Error loading video</h2><p style="margin-top:8px">${st.error}</p></div>`;
    if (!st.video)  return html``;

    const { video: v, recommendations: recs, comments } = st;
    const cc = avatarColor(v.channelName);

    return html`
      <div class="layout">
        <div class="main">

          <!-- Player -->
          <div class="player-wrap">
            <div class="player-inner">
              <img class="player-thumb" src="${v.thumbnailUrl}" alt="${v.title}" />
              <button class="play-btn" aria-label="Play">
                <svg viewBox="0 0 24 24" width="30" height="30" fill="#111"><path d="M8 5v14l11-7z"/></svg>
              </button>
            </div>
          </div>

          <h1>${v.title}</h1>

          <!-- Actions -->
          <div class="actions">
            <div class="like-group">
              <button class="${st.liked ? 'liked' : ''}" @click=${() => this.store.toggleLike()}>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                  <path d="${st.liked
                    ? 'M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z'
                    : 'M10 15.172l9.192-9.193 1.415 1.414L10 18l-6.364-6.364 1.414-1.414L10 15.172z'}"/>
                </svg>
                ${v.likeCount}
              </button>
              <div class="like-sep"></div>
              <button>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" style="transform:rotate(180deg)">
                  <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"/>
                </svg>
              </button>
            </div>

            <button class="action-btn">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92c0-1.61-1.31-2.92-2.92-2.92z"/></svg>
              Share
            </button>

            <button class="action-btn">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z"/></svg>
              Save
            </button>

            <button class="action-btn">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>
            </button>
          </div>

          <!-- Channel row (no dividers) -->
          <div class="channel-row">
            <div class="ch-av" style="background:${cc}"
              @click=${() => this._nav('/channel/' + v.channelId)}>
              ${v.channelAvatarInitials}
            </div>
            <div class="ch-info">
              <div class="ch-name" @click=${() => this._nav('/channel/' + v.channelId)}>${v.channelName}</div>
            </div>
            <button class="sub-btn ${st.subscribed ? 'subbed' : ''}"
              @click=${() => this.store.toggleSubscribe()}>
              ${st.subscribed ? 'Subscribed' : 'Subscribe'}
            </button>
          </div>

          <!-- Description -->
          <div class="desc-box" @click=${() => this.store.toggleDesc()}>
            <div class="desc-stats">${v.viewCount} views • ${v.publishedAgo}</div>
            <div class="desc-text ${st.descExpanded ? '' : 'clamp'}">${v.description}</div>
            <div class="desc-more">${st.descExpanded ? 'Show less' : '...more'}</div>
          </div>

          <!-- Comments -->
          <div class="comments">
            <div class="c-head">${comments.length * 12} Comments</div>
            <div class="c-input-row">
              <div class="c-av-sm">U</div>
              <input class="c-input" placeholder="Add a comment…" />
            </div>

            ${repeat(comments, (c: Comment) => c.id, (c: Comment) => html`
              <div class="comment">
                <div class="c-av" style="background:${c.authorColor}">${c.authorAvatarInitials}</div>
                <div class="c-body">
                  <div class="c-meta">
                    ${c.isPinned ? html`<span class="c-pinned">📌 Pinned</span>` : ''}
                    <span class="c-name">${c.authorName}</span>
                    <span class="c-ago">${c.publishedAgo}</span>
                  </div>
                  <div class="c-text">${c.text}</div>
                  <div class="c-acts">
                    <button class="c-act">
                      <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor"><path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"/></svg>
                      ${c.likeCount}
                    </button>
                    <button class="c-act">Reply</button>
                    ${c.replyCount > 0 ? html`<span style="font-size:12px;color:var(--tx-3);padding:0 4px">${c.replyCount} replies</span>` : ''}
                  </div>
                </div>
              </div>`)}
          </div>
        </div>

        <!-- Sidebar recommendations -->
        <div class="aside">
          ${repeat(recs, (v: Video) => v.id, (v: Video) => html`
            <div class="rec" @click=${() => this._nav('/watch?v=' + v.id)}>
              <div class="rec-thumb">
                <img src="${v.thumbnailUrl}" alt="${v.title}" loading="lazy" />
                <span class="rec-dur">${v.duration}</span>
              </div>
              <div class="rec-meta">
                <div class="rec-title">${v.title}</div>
                <div class="rec-ch">${v.channelName}</div>
                <div class="rec-stats">${v.viewCount} • ${v.publishedAgo}</div>
              </div>
            </div>`)}
        </div>
      </div>
    `;
  }
}

if (!customElements.get('yt-watch-page')) customElements.define('yt-watch-page', YtWatchPage);
