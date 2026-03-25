import { LitElement, css, html } from 'lit';

const MESSAGES = [
  { id:1, user:'firecode', color:'#7289da', time:'Today at 10:02 AM', text:'Has anyone tried Lit + TypeScript for Web Components? It is genuinely incredible how small the bundle size is compared to React.', avatar:'F' },
  { id:2, user:'pixel_wiz', color:'#43b581', time:'Today at 10:05 AM', text:'Yes! Been using it for 6 months now. The DX is amazing. Reactive properties, no JSX, just template literals. Production bundle <10KB 🔥', avatar:'P' },
  { id:3, user:'darkmode_dev', color:'#f04747', time:'Today at 10:08 AM', text:'The Shadow DOM isolation is a double-edged sword though. Styling from outside gets tricky sometimes.', avatar:'D' },
  { id:4, user:'firecode', color:'#7289da', time:'Today at 10:10 AM', text:'True, but CSS custom properties pierce shadow DOM so you can still theme everything centrally. Works great with design tokens.', avatar:'F' },
  { id:5, user:'nova_design', color:'#e91e63', time:'Today at 10:15 AM', text:'Just dropped a new portfolio — built entirely with Lit components. Zero framework overhead. Load time is insane https://example.dev', avatar:'N' },
  { id:6, user:'pixel_wiz', color:'#43b581', time:'Today at 10:17 AM', text:'That\'s literally under 50KB total? Love to see it. The ecosystem is growing fast too — Storybook support, VSCode extensions...', avatar:'P' },
  { id:7, user:'system_bot', color:'#99aab5', time:'Today at 10:20 AM', text:'📌 Pinned: Community guidelines updated. Check #announcements for details.', avatar:'🤖', isSystem: true },
  { id:8, user:'darkmode_dev', color:'#f04747', time:'Today at 10:22 AM', text:'Anyone building with web components at work? Or is it still mostly hobbyist/personal projects?', avatar:'D' },
  { id:9, user:'nova_design', color:'#e91e63', time:'Today at 10:25 AM', text:'We use it in prod at my company for the component library. Teams consuming it don\'t even need to know what framework it\'s built on — it just works everywhere.', avatar:'N' },
  { id:10, user:'you', color:'#7c4dff', time:'Today at 10:28 AM', text:'That\'s the dream right? Write once, run everywhere. That\'s what web standards are supposed to give us.', avatar:'U', isSelf: true },
];

const MEMBERS = [
  { user:'firecode', status:'online', color:'#7289da', av:'F' },
  { user:'pixel_wiz', status:'online', color:'#43b581', av:'P' },
  { user:'nova_design', status:'idle', color:'#e91e63', av:'N' },
  { user:'darkmode_dev', status:'dnd', color:'#f04747', av:'D' },
  { user:'you', status:'online', color:'#7c4dff', av:'U' },
];

const STATUS_COLOR: Record<string, string> = { online: '#23a559', idle: '#f0b232', dnd: '#f23f42', offline: '#80848e' };

export class DiscordServerPage extends LitElement {
  static override properties = { _msg: { type: String, state: true } };

  static override styles = css`
    :host {
      display: flex;
      height: 100%;
      background: #313338;
      color: #dbdee1;
      font-family: 'gg sans', system-ui, sans-serif;
      overflow: hidden;
    }

    /* ── Channel area ── */
    .channel-area {
      flex: 1; min-width: 0;
      display: flex; flex-direction: column;
      height: 100%;
    }

    /* ── Channel header ── */
    .channel-header {
      height: 48px; padding: 0 16px;
      display: flex; align-items: center; gap: 8px;
      background: #313338;
      border-bottom: 1px solid rgba(255,255,255,0.06);
      flex-shrink: 0;
      box-shadow: 0 1px 0 rgba(0,0,0,0.3);
    }
    .channel-icon { color: #949ba4; }
    .channel-name { font-size: 15px; font-weight: 700; color: #fff; }
    .channel-desc { font-size: 13px; color: #949ba4; margin-left: 4px; }
    .header-actions { margin-left: auto; display: flex; gap: 4px; }
    .h-btn {
      width: 34px; height: 34px; border-radius: 8px;
      border: none; background: none; cursor: pointer;
      color: #949ba4; display: flex; align-items: center; justify-content: center;
      transition: background 100ms, color 100ms;
    }
    .h-btn:hover { background: rgba(255,255,255,0.06); color: #dbdee1; }

    /* ── Messages ── */
    .messages {
      flex: 1; overflow-y: auto; padding: 16px 0 8px;
      scrollbar-width: thin; scrollbar-color: rgba(255,255,255,0.10) transparent;
    }
    .messages::-webkit-scrollbar { width: 4px; }
    .messages::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.10); border-radius: 2px; }

    .msg {
      display: flex; gap: 12px; padding: 4px 16px;
      transition: background 80ms;
    }
    .msg:hover { background: rgba(0,0,0,0.10); }
    .msg.system {
      background: rgba(255,165,0,0.05);
      border-left: 3px solid #f0b232;
      margin: 6px 16px; padding: 8px 12px; border-radius: 0 8px 8px 0;
    }
    .msg.self .msg-av { order: unset; }
    .msg-av {
      width: 38px; height: 38px; border-radius: 50%; flex-shrink: 0;
      display: flex; align-items: center; justify-content: center;
      font-size: 15px; font-weight: 700; color: #fff;
      margin-top: 2px;
    }
    .msg-body { flex: 1; min-width: 0; }
    .msg-meta { display: flex; align-items: baseline; gap: 8px; margin-bottom: 2px; }
    .msg-user { font-size: 14px; font-weight: 600; }
    .msg-time { font-size: 11px; color: #80848e; }
    .msg-text { font-size: 14px; line-height: 1.5; color: #dbdee1; word-break: break-word; }

    /* ── Message input ── */
    .input-area {
      padding: 8px 16px 16px; flex-shrink: 0;
    }
    .input-box {
      display: flex; align-items: center; gap: 8px;
      background: #383a40; border-radius: 10px;
      padding: 4px 8px 4px 16px;
    }
    .msg-input {
      flex: 1; background: none; border: none; outline: none;
      color: #dbdee1; font-size: 14px; font-family: inherit;
      padding: 9px 0;
    }
    .msg-input::placeholder { color: #6d6f78; }
    .send-btn {
      width: 30px; height: 30px; border-radius: 8px;
      border: none; background: none; cursor: pointer;
      color: #949ba4; display: flex; align-items: center; justify-content: center;
      transition: color 100ms;
    }
    .send-btn:hover { color: #dbdee1; }

    /* ── Members sidebar ── */
    .members-sidebar {
      width: 240px; flex-shrink: 0;
      background: #2b2d31;
      padding: 12px 0;
      overflow-y: auto;
      scrollbar-width: none;
      border-left: 1px solid rgba(255,255,255,0.05);
    }
    .members-sidebar::-webkit-scrollbar { display: none; }
    .members-label {
      padding: 6px 14px;
      font-size: 10px; font-weight: 700; letter-spacing: 1px;
      text-transform: uppercase; color: #949ba4;
    }
    .member {
      display: flex; align-items: center; gap: 9px;
      padding: 5px 10px; margin: 1px 6px; border-radius: 8px;
      cursor: pointer; position: relative;
      transition: background 100ms;
    }
    .member:hover { background: rgba(255,255,255,0.06); }
    .member-av {
      width: 32px; height: 32px; border-radius: 50%; flex-shrink: 0;
      display: flex; align-items: center; justify-content: center;
      font-size: 13px; font-weight: 700; color: #fff;
      position: relative;
    }
    .status-dot {
      position: absolute; bottom: -1px; right: -1px;
      width: 10px; height: 10px; border-radius: 50%;
      border: 2px solid #2b2d31;
    }
    .member-name { font-size: 13px; font-weight: 500; color: #b5bac1; }
  `;

  private _msg = '';

  override render() {
    return html`
      <div class="channel-area">
        <!-- Header -->
        <div class="channel-header">
          <svg class="channel-icon" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d="M10.17 5l-.85 4h4.15l.85-4H16l-.85 4H18v2h-3.17l-.85 4H16v2h-2.5l-.84 4h-1.83l.84-4H7.34l-.84 4H4.67l.84-4H3v-2h2.84l.85-4H5V9h1.99l.86-4h1.82z"/>
          </svg>
          <span class="channel-name">general</span>
          <span class="channel-desc">— the main hangout for everything</span>
          <div class="header-actions">
            <button class="h-btn" title="Search">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
            </button>
            <button class="h-btn" title="Pinned messages">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z"/></svg>
            </button>
            <button class="h-btn" title="Members">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
            </button>
          </div>
        </div>

        <!-- Messages -->
        <div class="messages">
          ${MESSAGES.map(m => m.isSystem ? html`
            <div class="msg system">
              <div class="msg-text" style="color:#f0b232;font-size:13px">${m.text}</div>
            </div>` : html`
            <div class="msg ${m.isSelf ? 'self' : ''}">
              <div class="msg-av" style="background:${m.color}">${m.avatar}</div>
              <div class="msg-body">
                <div class="msg-meta">
                  <span class="msg-user" style="color:${m.color}">${m.user}</span>
                  <span class="msg-time">${m.time}</span>
                </div>
                <div class="msg-text">${m.text}</div>
              </div>
            </div>`)}
        </div>

        <!-- Input -->
        <div class="input-area">
          <div class="input-box">
            <button class="send-btn" title="Add attachment">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M16.5 6v11.5c0 2.21-1.79 4-4 4s-4-1.79-4-4V5a2.5 2.5 0 0 1 5 0v10.5c0 .55-.45 1-1 1s-1-.45-1-1V6H10v9.5a2.5 2.5 0 0 0 5 0V5c0-2.21-1.79-4-4-4S7 2.79 7 5v12.5c0 3.04 2.46 5.5 5.5 5.5s5.5-2.46 5.5-5.5V6h-1.5z"/></svg>
            </button>
            <input class="msg-input" placeholder="Message #general"
              .value=${this._msg}
              @input=${(e: InputEvent) => { this._msg = (e.target as HTMLInputElement).value; }}/>
            <button class="send-btn" title="Emoji">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/></svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Members sidebar -->
      <div class="members-sidebar">
        <div class="members-label">Online — ${MEMBERS.filter(m => m.status === 'online').length}</div>
        ${MEMBERS.filter(m => m.status === 'online').map(m => html`
          <div class="member">
            <div class="member-av" style="background:${m.color}">
              ${m.av}
              <div class="status-dot" style="background:${STATUS_COLOR[m.status]}"></div>
            </div>
            <span class="member-name">${m.user}</span>
          </div>`)}
        <div class="members-label" style="margin-top:8px">Away — ${MEMBERS.filter(m => m.status !== 'online').length}</div>
        ${MEMBERS.filter(m => m.status !== 'online').map(m => html`
          <div class="member" style="opacity:0.6">
            <div class="member-av" style="background:${m.color}">
              ${m.av}
              <div class="status-dot" style="background:${STATUS_COLOR[m.status]}"></div>
            </div>
            <span class="member-name">${m.user}</span>
          </div>`)}
      </div>
    `;
  }
}

if (!customElements.get('discord-server-page')) customElements.define('discord-server-page', DiscordServerPage);
