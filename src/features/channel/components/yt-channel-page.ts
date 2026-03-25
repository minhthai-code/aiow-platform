import { LitElement, html, css } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import type { ChannelStore, ChannelState } from '../state/channel-store';
import type { Video } from '@core/types';
import { avatarColor } from '@libs/utils/mock-data';
import { getRegisteredService } from '@core/runtime-api/platform-element';
import type { NavigationController } from '@core/router/router';
import '@libs/components/media/yt-video-card';

export class YtChannelPage extends LitElement {
  static override properties = {
    store: { type: Object, attribute: false },
    _st:   { type: Object, state: true },
  };

  static override styles = css`
    :host { display:block; }
    .banner { width:100%; height:176px; position:relative; overflow:hidden; }
    .banner-wm { position:absolute; inset:0; display:flex; align-items:center; justify-content:center; font-size:180px; font-weight:900; color:rgba(255,255,255,.06); pointer-events:none; user-select:none; overflow:hidden; }
    .ch-header { padding:0 24px; max-width:1284px; margin:0 auto; }
    .ch-top { display:flex; align-items:flex-start; gap:24px; padding:16px 0; }
    .ch-av { width:80px; height:80px; border-radius:50%; flex-shrink:0; display:flex; align-items:center; justify-content:center; font-size:32px; font-weight:500; color:#fff; }
    .ch-info { flex:1; }
    .ch-name { font-size:28px; font-weight:700; margin-bottom:6px; }
    .ch-handle { font-size:14px; color:var(--text-secondary,#aaa); margin-bottom:4px; }
    .ch-stats { font-size:14px; color:var(--text-secondary,#aaa); margin-bottom:16px; }
    .sub-btn { padding:10px 20px; border-radius:999px; background:var(--text-primary,#f1f1f1); color:var(--bg-primary,#0f0f0f); font-size:14px; font-weight:500; border:none; cursor:pointer; font-family:inherit; transition:opacity 80ms ease; }
    .sub-btn:hover { opacity:.85; }
    .sub-btn.subbed { background:var(--chip-bg,#272727); color:var(--text-primary,#f1f1f1); }
    .tabs { display:flex; border-bottom:1px solid var(--border,rgba(255,255,255,0.1)); margin:0 -24px; padding:0 24px; overflow-x:auto; scrollbar-width:none; }
    .tabs::-webkit-scrollbar { display:none; }
    .tab { padding:12px 16px; font-size:14px; font-weight:500; cursor:pointer; white-space:nowrap; border:none; border-bottom:2px solid transparent; background:none; color:var(--text-secondary,#aaa); font-family:inherit; transition:color 80ms ease, border-color 80ms ease; }
    .tab:hover { color:var(--text-primary,#f1f1f1); }
    .tab.active { border-bottom-color:var(--text-primary,#f1f1f1); color:var(--text-primary,#f1f1f1); }
    .content { padding:24px; max-width:1284px; margin:0 auto; }
    .sec-title { font-size:16px; font-weight:600; margin-bottom:16px; }
    .grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(220px,1fr)); gap:12px 8px; margin-bottom:32px; }
    .about { font-size:14px; line-height:1.7; color:var(--text-secondary,#aaa); max-width:640px; }
    .sk { border-radius:4px; background:linear-gradient(90deg,#222 25%,#2a2a2a 50%,#222 75%); background-size:200% 100%; animation:sh 1.5s infinite; }
    @keyframes sh { 0%{background-position:200% 0}100%{background-position:-200% 0} }
    @media(max-width:720px) { .ch-av { width:56px; height:56px; font-size:22px; } .ch-name { font-size:20px; } .grid { grid-template-columns:repeat(auto-fill,minmax(160px,1fr)); } }
  `;

  store!: ChannelStore;
  private _st!: ChannelState;
  private _unsub?: () => void;
  private readonly TABS = ['Home','Videos','Shorts','Live','Playlists','Community','About'];

  override connectedCallback(): void {
    super.connectedCallback();
    this._st = this.store.getState();
    this._unsub = this.store.subscribe(s => { this._st = s; this.requestUpdate(); });
  }
  override disconnectedCallback(): void { super.disconnectedCallback(); this._unsub?.(); }

  private _nav(path: string) { getRegisteredService<NavigationController>('Router').push(path); }

  private _skeleton() {
    return html`
      <div class="sk" style="width:100%;height:176px"></div>
      <div class="ch-header">
        <div class="ch-top">
          <div class="sk" style="width:80px;height:80px;border-radius:50%;flex-shrink:0"></div>
          <div style="flex:1;display:flex;flex-direction:column;gap:12px;padding-top:8px">
            <div class="sk" style="height:28px;width:240px"></div>
            <div class="sk" style="height:14px;width:160px"></div>
          </div>
        </div>
      </div>`;
  }

  override render() {
    const st = this._st;
    if (!st)         return html``;
    if (st.loading)  return this._skeleton();
    if (st.error)    return html`<div style="padding:48px;text-align:center;color:#f1f1f1"><h2>Failed to load channel</h2><p style="color:#aaa">${st.error}</p></div>`;
    if (!st.channel) return html``;

    const { channel: ch, videos } = st;
    const color = avatarColor(ch.name);

    return html`
      <div class="banner" style="background:${ch.bannerGradient}">
        <div class="banner-wm">${ch.avatarInitials}</div>
      </div>
      <div class="ch-header">
        <div class="ch-top">
          <div class="ch-av" style="background:${color}">${ch.avatarInitials}</div>
          <div class="ch-info">
            <div class="ch-name">${ch.name}</div>
            <div class="ch-handle">${ch.handle} • ${ch.subscriberCount}</div>
            <div class="ch-stats">${ch.videoCount} videos</div>
            <button class="sub-btn ${st.subscribed ? 'subbed' : ''}" @click=${() => this.store.toggleSub()}>
              ${st.subscribed ? 'Subscribed' : 'Subscribe'}
            </button>
          </div>
        </div>
        <div class="tabs" role="tablist">
          ${this.TABS.map(t => html`
            <button class="tab ${t === st.activeTab ? 'active' : ''}" role="tab"
              @click=${() => this.store.setTab(t)}>${t}</button>`)}
        </div>
      </div>
      <div class="content">
        ${videos.length > 0 ? html`
          <div class="sec-title">Latest videos</div>
          <div class="grid"
            @video-click=${(e: CustomEvent<{videoId:string}>) => this._nav('/watch?v=' + e.detail.videoId)}
            @channel-click=${(e: CustomEvent<{channelId:string}>) => this._nav('/channel/' + e.detail.channelId)}>
            ${repeat(videos, (v: Video) => v.id, (v: Video) => html`
              <yt-video-card .video=${v}></yt-video-card>`)}
          </div>` : ''}
        <div class="sec-title">About</div>
        <div class="about">${ch.description}</div>
      </div>`;
  }
}
if (!customElements.get('yt-channel-page')) customElements.define('yt-channel-page', YtChannelPage);
