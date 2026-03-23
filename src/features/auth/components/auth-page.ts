import { LitElement, css, html } from 'lit';

export class AuthPage extends LitElement {
  static override properties = { _mode:{ type:String, state:true }, _email:{ type:String, state:true }, _pwd:{ type:String, state:true } };
  static override styles = css`
    :host { display:flex; align-items:center; justify-content:center; min-height:100%; background:var(--bg-base); padding:32px 16px; font-family:-apple-system,BlinkMacSystemFont,'SF Pro Text',sans-serif; }
    .card { width:100%; max-width:400px; }
    .logo-area { text-align:center; margin-bottom:32px; }
    .logo-mark { width:52px; height:52px; border-radius:14px; background:var(--brand); margin:0 auto 12px; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 16px var(--brand-glow); }
    .logo-text { font-size:24px; font-weight:700; color:var(--tx-1); letter-spacing:-0.5px; }
    .logo-sub  { font-size:14px; color:var(--tx-2); margin-top:4px; }

    .form-card { background:var(--bg-surface); border:1px solid var(--bd-1); border-radius:20px; padding:28px; box-shadow:var(--shadow-lg); }
    .tab-row { display:flex; background:var(--bg-raised); border-radius:10px; padding:3px; margin-bottom:24px; }
    .tab { flex:1; padding:7px; border-radius:8px; border:none; background:none; color:var(--tx-2); font-size:13.5px; font-weight:500; cursor:pointer; transition:background 120ms, color 120ms; font-family:inherit; }
    .tab.active { background:var(--bg-surface); color:var(--tx-1); font-weight:600; box-shadow:var(--shadow-sm); }

    .field { margin-bottom:14px; }
    label { display:block; font-size:12.5px; font-weight:500; color:var(--tx-2); margin-bottom:5px; }
    input[type=text], input[type=email], input[type=password] {
      width:100%; box-sizing:border-box; padding:10px 14px;
      background:var(--bg-raised); border:1.5px solid var(--bd-1);
      border-radius:10px; color:var(--tx-1); font-size:14px;
      font-family:inherit; outline:none;
      transition:border-color 120ms, background 120ms;
    }
    input:focus { border-color:var(--brand); background:var(--bg-overlay); }

    .submit-btn { width:100%; margin-top:6px; padding:12px; border-radius:12px; border:none; background:var(--brand); color:#fff; font-size:15px; font-weight:600; cursor:pointer; transition:opacity 100ms, transform 100ms; font-family:inherit; }
    .submit-btn:hover { opacity:0.90; }
    .submit-btn:active { transform:scale(0.98); }

    .divider { display:flex; align-items:center; gap:12px; margin:20px 0; }
    .divider-line { flex:1; height:1px; background:var(--bd-1); }
    .divider-text { font-size:12px; color:var(--tx-3); white-space:nowrap; }

    .social-btn { display:flex; align-items:center; justify-content:center; gap:8px; width:100%; margin-bottom:10px; padding:10px; border-radius:12px; border:1.5px solid var(--bd-1); background:var(--bg-raised); color:var(--tx-1); font-size:13.5px; font-weight:500; cursor:pointer; transition:background 100ms, border-color 100ms; font-family:inherit; }
    .social-btn:hover { background:var(--bg-overlay); border-color:var(--bd-2); }
    .social-btn svg { flex-shrink:0; }

    .footer-text { text-align:center; font-size:12px; color:var(--tx-3); margin-top:18px; line-height:1.5; }
    .link { color:var(--brand); font-weight:500; cursor:pointer; }
    .link:hover { opacity:0.80; }
  `;

  private _mode = 'login';
  private _email = '';
  private _pwd = '';

  override render() {
    const isLogin = this._mode === 'login';
    return html`
      <div class="card">
        <div class="logo-area">
          <div class="logo-mark">
            <svg viewBox="0 0 24 24" width="28" height="28" fill="white">
              <path d="M21.58 7.19c-.23-.86-.91-1.54-1.77-1.77C18.25 5 12 5 12 5s-6.25 0-7.81.42c-.86.23-1.54.91-1.77 1.77C2 8.75 2 12 2 12s0 3.25.42 4.81c.23.86.91 1.54 1.77 1.77C5.75 19 12 19 12 19s6.25 0 7.81-.42c.86-.23 1.54-.91 1.77-1.77C22 15.25 22 12 22 12s0-3.25-.42-4.81zM10 15V9l5.2 3-5.2 3z"/>
            </svg>
          </div>
          <div class="logo-text">YTube</div>
          <div class="logo-sub">${isLogin ? 'Sign in to continue' : 'Create your account'}</div>
        </div>

        <div class="form-card">
          <div class="tab-row">
            <button class="tab ${this._mode==='login'?'active':''}" @click=${()=>{this._mode='login';this.requestUpdate();}}>Sign In</button>
            <button class="tab ${this._mode==='register'?'active':''}" @click=${()=>{this._mode='register';this.requestUpdate();}}>Create Account</button>
          </div>

          <!-- Social buttons -->
          <button class="social-btn">
            <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            Continue with Google
          </button>
          <button class="social-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="var(--tx-1)"><path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12.017 24c6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641 0 12.017 0z"/></svg>
            Continue with GitHub
          </button>

          <div class="divider"><div class="divider-line"></div><span class="divider-text">or with email</span><div class="divider-line"></div></div>

          ${!isLogin ? html`<div class="field"><label>Full Name</label><input type="text" placeholder="Your full name"/></div>` : ''}
          <div class="field"><label>Email</label><input type="email" placeholder="you@example.com" .value=${this._email} @input=${(e:InputEvent)=>{this._email=(e.target as HTMLInputElement).value;}}/></div>
          <div class="field"><label>Password</label><input type="password" placeholder="••••••••" .value=${this._pwd} @input=${(e:InputEvent)=>{this._pwd=(e.target as HTMLInputElement).value;}}/></div>
          ${isLogin ? html`<div style="text-align:right;margin-top:-8px;margin-bottom:14px"><span class="link" style="font-size:12px">Forgot password?</span></div>` : ''}
          <button class="submit-btn">${isLogin ? 'Sign In' : 'Create Account'}</button>

          <div class="footer-text">
            ${isLogin ? html`Don't have an account? <span class="link" @click=${()=>{this._mode='register';this.requestUpdate();}}>Sign up free</span>` : html`Already have an account? <span class="link" @click=${()=>{this._mode='login';this.requestUpdate();}}>Sign in</span>`}
          </div>
        </div>
      </div>
    `;
  }
}
if (!customElements.get('auth-page')) customElements.define('auth-page', AuthPage);
