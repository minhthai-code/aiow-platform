import { LitElement, html, css } from 'lit';
import type { Video } from '@core/types';
import { avatarColor } from '@libs/utils/mock-data';
import '@libs/components/feedback/yt-context-menu';

/* ── Content type detection ─────────────────────────── */
interface TypeMeta { icon: string; label: string; color: string; }

const MUSIC_ICON  = 'M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z';
const VIDEO_ICON  = 'M21.58 7.19c-.23-.86-.91-1.54-1.77-1.77C18.25 5 12 5 12 5s-6.25 0-7.81.42c-.86.23-1.54.91-1.77 1.77C2 8.75 2 12 2 12s0 3.25.42 4.81c.23.86.91 1.54 1.77 1.77C5.75 19 12 19 12 19s6.25 0 7.81-.42c.86-.23 1.54-.91 1.77-1.77C22 15.25 22 12 22 12s0-3.25-.42-4.81zM10 15V9l5.2 3-5.2 3z';
const LIVE_ICON   = 'M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z';
const SHORT_ICON  = 'M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z';
const PODCAST_ICON= 'M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z';

function getTypeMeta(v: Video): TypeMeta {
  const cats = (v.category ?? '').toLowerCase();
  const tags  = v.tags.map(t => t.toLowerCase());
  if (v.duration === 'LIVE') return { icon: LIVE_ICON,   label: 'LIVE',    color: '#ef4444' };
  if (cats === 'music'  || tags.includes('music'))   return { icon: MUSIC_ICON,  label: 'Music',   color: '#a855f7' };
  if (cats === 'podcast'|| tags.includes('podcast')) return { icon: PODCAST_ICON,label: 'Podcast', color: '#06b6d4' };
  // Short: duration under 3 min and no colon at position > 1
  const d = v.duration;
  if (!d.includes(':') || (d.split(':')[0]!.length === 1 && parseInt(d.split(':')[0]!) < 3))
    return { icon: SHORT_ICON, label: 'Short', color: '#f59e0b' };
  return { icon: VIDEO_ICON, label: 'Video', color: 'rgba(255,255,255,0.45)' };
}

export class YtVideoCard extends LitElement {
  static override properties = {
    video:     { type: Object },
    _menuOpen: { type: Boolean, state: true },
    _menuX:    { type: Number,  state: true },
    _menuY:    { type: Number,  state: true },
  };

  static override styles = css`
    :host { display: block; }

    .card {
      border-radius: 12px;
      padding: 8px 8px 4px;
      cursor: pointer;
      position: relative;
      outline: none;
      transition: background 100ms ease;
    }
    .card:hover        { background: var(--bg-hover); }
    .card:focus-visible { box-shadow: 0 0 0 2px var(--brand); }

    /* ── Thumbnail ── */
    .thumb-wrap {
      position: relative;
      width: 100%; padding-top: 56.25%;
      border-radius: 10px;
      overflow: hidden;
      background: var(--bg-raised);
      margin-bottom: 0;
    }
    img.thumb {
      position: absolute; inset: 0;
      width: 100%; height: 100%;
      object-fit: cover;
    }

    /* Duration pill — semi-transparent grey, like YouTube (Image 3) */
    .duration {
      position: absolute; bottom: 6px; right: 6px;
      background: rgba(0,0,0,0.60);
      backdrop-filter: blur(3px);
      -webkit-backdrop-filter: blur(3px);
      color: rgba(255,255,255,0.95);
      font-size: 11px; font-weight: 600;
      padding: 2px 5px; border-radius: 4px;
      letter-spacing: 0.3px; line-height: 1;
    }

    /* LIVE badge */
    .duration.live {
      background: rgba(220,38,38,0.85);
      color: #fff;
    }

    /* Content-type badge — bottom left of thumbnail */
    .type-badge {
      position: absolute; bottom: 6px; left: 6px;
      display: flex; align-items: center; gap: 3px;
      background: rgba(0,0,0,0.55);
      backdrop-filter: blur(4px);
      -webkit-backdrop-filter: blur(4px);
      border-radius: 4px;
      padding: 2px 6px 2px 4px;
      font-size: 10px; font-weight: 700;
      color: rgba(255,255,255,0.85);
      letter-spacing: 0.3px;
    }

    /* ── Meta row ── */
    .meta-row {
      display: flex; gap: 9px;
      padding: 9px 2px 0;
    }

    .avatar {
      width: 32px; height: 32px; border-radius: 50%;
      flex-shrink: 0; margin-top: 1px;
      display: flex; align-items: center; justify-content: center;
      font-size: 12px; font-weight: 700; color: #fff;
      transition: opacity 80ms ease; cursor: pointer;
    }
    .avatar:hover { opacity: 0.82; }

    .meta { flex: 1; min-width: 0; }

    .title {
      font-size: 13.5px; font-weight: 500; line-height: 1.35;
      color: var(--tx-1);
      display: -webkit-box; -webkit-line-clamp: 2;
      -webkit-box-orient: vertical; overflow: hidden;
      margin-bottom: 4px;
    }
    .ch-name {
      font-size: 12px; color: var(--tx-2);
      display: flex; align-items: center; gap: 3px;
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
      margin-bottom: 2px; cursor: pointer;
    }
    .ch-name:hover { color: var(--tx-1); }
    .stats { font-size: 11.5px; color: var(--tx-3); }
    .verified { display: inline-flex; align-items: center; flex-shrink: 0; }

    /* ── 3-dot — BELOW meta row (like Image 3) ── */
    .bottom-row {
      display: flex;
      justify-content: flex-end;
      padding: 3px 2px 2px;
    }
    /* 3-dot: very faint white at rest (always visible), circle on hover */
    .more-btn {
      width: 28px; height: 28px; border-radius: 50%;
      background: none; border: none;
      display: flex; align-items: center; justify-content: center;
      cursor: pointer;
      color: rgba(255,255,255,0.18);   /* light white, always visible */
      transition: color 100ms ease, background 100ms ease;
    }
    .more-btn:hover {
      background: var(--bg-hover);
      color: var(--tx-1);              /* full bright on hover */
      border-radius: 50%;
    }
    .more-btn:active { transform: scale(0.86); }
  `;

  video: Video | null = null;
  private _menuOpen = false;
  private _menuX    = 0;
  private _menuY    = 0;

  private _openMenu(e: MouseEvent): void {
    e.stopPropagation();
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    let x = rect.left - 180;
    let y = rect.top - 8;
    if (x < 8) x = 8;
    if (y + 250 > window.innerHeight) y = window.innerHeight - 258;
    this._menuX = x; this._menuY = y;
    this._menuOpen = true; this.requestUpdate();
  }

  override render() {
    if (!this.video) return html``;
    const v    = this.video;
    const col  = avatarColor(v.channelName);
    const type = getTypeMeta(v);
    const isLive = v.duration === 'LIVE';

    return html`
      <div class="card" tabindex="0" role="article"
        @click=${()=>this.dispatchEvent(new CustomEvent('video-click',{detail:{videoId:v.id},bubbles:true,composed:true}))}
        @keydown=${(e:KeyboardEvent)=>e.key==='Enter'&&this.dispatchEvent(new CustomEvent('video-click',{detail:{videoId:v.id},bubbles:true,composed:true}))}>

        <!-- Thumbnail -->
        <div class="thumb-wrap">
          <img class="thumb" src="${v.thumbnailUrl}" alt="${v.title}"
            loading="lazy" decoding="async"
            @error=${(e:Event)=>{(e.target as HTMLImageElement).style.opacity='0';}}/>

          <!-- Type badge: bottom-left -->
          <div class="type-badge">
            <svg viewBox="0 0 24 24" width="10" height="10" fill="${type.color}">
              <path d="${type.icon}"/>
            </svg>
            ${type.label}
          </div>

          <!-- Duration: bottom-right — semi-transparent -->
          <span class="duration ${isLive?'live':''}">
            ${isLive ? '● LIVE' : v.duration}
          </span>
        </div>

        <!-- Meta -->
        <div class="meta-row">
          <div class="avatar" style="background:${col}"
            @click=${(e:Event)=>{e.stopPropagation();this.dispatchEvent(new CustomEvent('channel-click',{detail:{channelId:v.channelId},bubbles:true,composed:true}));}}>
            ${v.channelAvatarInitials}
          </div>
          <div class="meta">
            <div class="title">${v.title}</div>
            <div class="ch-name"
              @click=${(e:Event)=>{e.stopPropagation();this.dispatchEvent(new CustomEvent('channel-click',{detail:{channelId:v.channelId},bubbles:true,composed:true}));}}>
              ${v.channelName}
              ${v.channelVerified?html`<span class="verified"><svg viewBox="0 0 24 24" width="11" height="11" fill="rgba(138,138,138,0.7)"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/></svg></span>`:''}
            </div>
            <div class="stats">${v.viewCount} · ${v.publishedAgo}</div>
          </div>
        </div>

        <!-- 3-dot below meta (Image 3 style) -->
        <div class="bottom-row">
          <button class="more-btn" title="More options" @click=${this._openMenu.bind(this)}>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
            </svg>
          </button>
        </div>
      </div>

      <yt-context-menu .open=${this._menuOpen} .x=${this._menuX} .y=${this._menuY}
        @close=${()=>{this._menuOpen=false;this.requestUpdate();}}></yt-context-menu>
    `;
  }
}
if (!customElements.get('yt-video-card')) customElements.define('yt-video-card', YtVideoCard);
