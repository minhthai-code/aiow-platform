import { LitElement, html, css } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import type { SearchStore, SearchState } from '../state/search-store';
import type { Video } from '@core/types';
import { avatarColor } from '@libs/utils/mock-data';
import { getRegisteredService } from '@core/runtime-api/platform-element';
import type { NavigationController } from '@core/router/router';

export class YtSearchPage extends LitElement {
  static override properties = {
    store: { type: Object, attribute: false },
    _st:   { type: Object, state: true },
  };

  static override styles = css`
    :host { display:block; }
    .page { padding:20px 24px; max-width:1080px; }
    .count { font-size:13px; color:var(--text-secondary,#aaa); margin-bottom:16px; }
    .count strong { color:var(--text-primary,#f1f1f1); }
    .filters { display:flex; gap:8px; margin-bottom:20px; flex-wrap:wrap; }
    .f-btn { padding:6px 14px; border-radius:4px; background:var(--chip-bg,#272727); font-size:14px; border:none; cursor:pointer; color:var(--text-primary,#f1f1f1); font-family:inherit; transition:background 80ms ease; }
    .f-btn:hover  { background:#3d3d3d; }
    .f-btn.active { background:var(--text-primary,#f1f1f1); color:var(--bg-primary,#0f0f0f); font-weight:500; }
    .result { display:flex; gap:16px; margin-bottom:20px; cursor:pointer; }
    .r-thumb { position:relative; width:360px; flex-shrink:0; border-radius:12px; overflow:hidden; background:var(--bg-tertiary,#222); }
    .r-thumb img { width:360px; height:202px; object-fit:cover; display:block; transition:transform 200ms ease; }
    
    .r-dur { position:absolute; bottom:8px; right:8px; background:rgba(0,0,0,.85); color:#fff; font-size:12px; font-weight:500; padding:2px 6px; border-radius:4px; }
    .r-meta { flex:1; padding-top:4px; }
    .r-title { font-size:18px; font-weight:400; line-height:1.4; margin-bottom:8px; color:var(--text-primary,#f1f1f1); }
    .r-stats { font-size:13px; color:var(--text-secondary,#aaa); margin-bottom:10px; }
    .r-ch { display:flex; align-items:center; gap:8px; margin-bottom:10px; }
    .r-av { width:24px; height:24px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:11px; font-weight:500; color:#fff; }
    .r-chname { font-size:13px; color:var(--text-secondary,#aaa); }
    .r-desc { font-size:14px; color:var(--text-secondary,#aaa); line-height:1.5; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
    .empty { text-align:center; padding:64px 24px; color:var(--text-secondary,#aaa); }
    .empty h2 { color:var(--text-primary,#f1f1f1); margin-bottom:8px; font-size:20px; }
    .sk { border-radius:4px; background:linear-gradient(90deg,#222 25%,#2a2a2a 50%,#222 75%); background-size:200% 100%; animation:sh 1.5s infinite; }
    @keyframes sh { 0%{background-position:200% 0}100%{background-position:-200% 0} }
    @media(max-width:720px) { .r-thumb, .r-thumb img { width:240px; height:135px; } .r-title { font-size:15px; } }
  `;

  store!: SearchStore;
  private _st!: SearchState;
  private _unsub?: () => void;
  private readonly FILTERS = ['All','Upload date','View count','Rating'];

  override connectedCallback(): void {
    super.connectedCallback();
    this._st = this.store.getState();
    this._unsub = this.store.subscribe(s => { this._st = s; this.requestUpdate(); });
  }
  override disconnectedCallback(): void { super.disconnectedCallback(); this._unsub?.(); }

  private _nav(path: string) { getRegisteredService<NavigationController>('Router').push(path); }

  override render() {
    const st = this._st;
    if (!st) return html``;

    return html`
      <div class="page">
        ${st.query ? html`<div class="count">About ${st.results.length * 1240} results for <strong>"${st.query}"</strong></div>` : ''}
        <div class="filters">
          ${this.FILTERS.map(f => html`
            <button class="f-btn ${f === st.activeFilter ? 'active' : ''}" @click=${() => this.store.setFilter(f)}>${f}</button>`)}
        </div>
        ${st.loading ? html`
          ${Array.from({length:5}).map(()=>html`
            <div style="display:flex;gap:16px;margin-bottom:20px">
              <div class="sk" style="width:360px;height:202px;border-radius:12px;flex-shrink:0"></div>
              <div style="flex:1;display:flex;flex-direction:column;gap:12px;padding-top:4px">
                <div class="sk" style="height:22px;width:85%"></div>
                <div class="sk" style="height:14px;width:40%"></div>
                <div class="sk" style="height:14px;width:70%"></div>
              </div>
            </div>`)}`
        : st.results.length === 0 ? html`
          <div class="empty"><h2>No results found</h2><p>Try different keywords</p></div>`
        : repeat(st.results, (v: Video) => v.id, (v: Video) => {
            const c = avatarColor(v.channelName);
            return html`
              <div class="result" @click=${() => this._nav('/watch?v=' + v.id)}>
                <div class="r-thumb">
                  <img src="${v.thumbnailUrl}" alt="${v.title}" loading="lazy" />
                  <span class="r-dur">${v.duration}</span>
                </div>
                <div class="r-meta">
                  <div class="r-title">${v.title}</div>
                  <div class="r-stats">${v.viewCount} views • ${v.publishedAgo}</div>
                  <div class="r-ch">
                    <div class="r-av" style="background:${c}">${v.channelAvatarInitials}</div>
                    <div class="r-chname" @click=${(e: Event) => { e.stopPropagation(); this._nav('/channel/' + v.channelId); }}>${v.channelName}</div>
                  </div>
                  <div class="r-desc">${v.description}</div>
                </div>
              </div>`;
          })}
      </div>`;
  }
}
if (!customElements.get('yt-search-page')) customElements.define('yt-search-page', YtSearchPage);
