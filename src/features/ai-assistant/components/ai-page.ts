import { LitElement, css, html } from 'lit';

const MODELS = [
  { id:'claude', name:'Claude Sonnet', color:'#c65440', desc:'Most intelligent' },
  { id:'gpt4',   name:'GPT-4o',        color:'#10a37f', desc:'Latest OpenAI' },
  { id:'gemini', name:'Gemini Pro',    color:'#4285f4', desc:'Google DeepMind' },
];
const SAMPLE_MESSAGES = [
  { role:'user',      text:'Can you explain how transformer attention works in simple terms?' },
  { role:'assistant', text:'Great question! Think of attention like a spotlight. When reading a sentence, instead of reading each word in order, you can instantly shine a spotlight on ANY word that\'s relevant to understanding your current word.\n\nFor example, in "The animal didn\'t cross the street because it was too tired" — when processing "it", attention lets the model shine a spotlight back to "animal" (not "street") because that\'s the relevant reference.\n\nMathematically, each word creates three vectors:\n• **Query** — "what am I looking for?"\n• **Key** — "what do I represent?"\n• **Value** — "what information do I carry?"\n\nAttention score = dot product of Query × Key, then softmax to get weights, then weighted sum of Values. Elegant, right?' },
  { role:'user',      text:'Show me a simple Python implementation' },
  { role:'assistant', text:'```python\nimport torch\nimport torch.nn.functional as F\n\ndef scaled_dot_product_attention(Q, K, V):\n    d_k = Q.size(-1)\n    scores = torch.matmul(Q, K.transpose(-2, -1)) / (d_k ** 0.5)\n    weights = F.softmax(scores, dim=-1)\n    return torch.matmul(weights, V), weights\n\n# Example usage\nseq_len, d_model = 5, 64\nQ = torch.randn(seq_len, d_model)\nK = torch.randn(seq_len, d_model)\nV = torch.randn(seq_len, d_model)\n\noutput, attn_weights = scaled_dot_product_attention(Q, K, V)\nprint(f"Output shape: {output.shape}")  # (5, 64)\nprint(f"Attention weights: {attn_weights.shape}")  # (5, 5)\n```\nThat\'s the core! Modern transformers use **multi-head** attention — running this multiple times in parallel to capture different relationship types.' },
];

export class AIPage extends LitElement {
  static override properties = { _model:{ type:String, state:true }, _input:{ type:String, state:true } };
  static override styles = css`
    :host { display:flex; height:100%; background:var(--bg-base); color:var(--tx-1); font-family:-apple-system,BlinkMacSystemFont,'SF Pro Text',sans-serif; }
    .layout { display:flex; flex-direction:column; flex:1; max-width:860px; margin:0 auto; padding:0 20px; width:100%; }

    /* Model picker */
    .model-bar { display:flex; gap:8px; padding:16px 0 12px; flex-wrap:wrap; }
    .model-btn {
      display:flex; align-items:center; gap:7px;
      padding:6px 14px; border-radius:999px;
      border:1.5px solid var(--bd-1); background:var(--bg-surface);
      color:var(--tx-2); font-size:12.5px; font-weight:500;
      cursor:pointer; transition:all 120ms; font-family:inherit;
    }
    .model-btn:hover { border-color:var(--bd-2); color:var(--tx-1); }
    .model-btn.active { background:var(--tx-1); border-color:transparent; color:var(--tx-inv); }
    .model-dot { width:8px; height:8px; border-radius:50%; flex-shrink:0; }

    /* Messages */
    .messages { flex:1; overflow-y:auto; padding:12px 0; scrollbar-width:thin; scrollbar-color:var(--bd-1) transparent; }
    .msg { margin-bottom:24px; }
    .msg.user { display:flex; justify-content:flex-end; }
    .msg-bubble {
      max-width:72%; padding:12px 16px; border-radius:18px;
      font-size:14px; line-height:1.6;
    }
    .msg.user .msg-bubble { background:var(--tx-1); color:var(--tx-inv); border-radius:18px 18px 4px 18px; }
    .msg.assistant .msg-bubble { background:var(--bg-surface); border:1px solid var(--bd-1); border-radius:18px 18px 18px 4px; white-space:pre-wrap; }
    .assistant-header { display:flex; align-items:center; gap:8px; margin-bottom:10px; }
    .assistant-av { width:28px; height:28px; border-radius:50%; background:linear-gradient(135deg,#8a2be2,#c65440); display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:700; color:#fff; flex-shrink:0; }
    code { background:var(--bg-raised); padding:2px 6px; border-radius:5px; font-size:13px; font-family:monospace; }
    pre { background:var(--bg-raised); border:1px solid var(--bd-1); border-radius:10px; padding:14px; overflow-x:auto; font-size:12.5px; line-height:1.6; margin:8px 0; font-family:monospace; }

    /* Input */
    .input-area { padding:14px 0 20px; }
    .input-box {
      display:flex; align-items:flex-end; gap:10px;
      background:var(--bg-surface); border:1.5px solid var(--bd-1);
      border-radius:16px; padding:10px 12px;
      transition:border-color 150ms;
    }
    .input-box:focus-within { border-color:var(--bd-2); }
    .input-box textarea {
      flex:1; background:none; border:none; outline:none;
      color:var(--tx-1); font-size:14px; font-family:inherit;
      resize:none; min-height:24px; max-height:200px; line-height:1.5;
    }
    .input-box textarea::placeholder { color:var(--tx-3); }
    .send { width:36px; height:36px; border-radius:10px; border:none; background:var(--tx-1); color:var(--tx-inv); cursor:pointer; display:flex; align-items:center; justify-content:center; flex-shrink:0; transition:opacity 100ms; }
    .send:hover { opacity:0.85; }
    .capabilities { display:flex; gap:6px; margin-bottom:10px; flex-wrap:wrap; }
    .cap-chip { padding:4px 12px; border-radius:999px; border:1px solid var(--bd-1); background:var(--bg-surface); color:var(--tx-2); font-size:11.5px; cursor:pointer; transition:background 100ms, color 100ms; }
    .cap-chip:hover { background:var(--bg-hover); color:var(--tx-1); }
  `;

  private _model = 'claude';
  private _input = '';

  private _renderMsg(msg: {role:string; text:string}) {
    if (msg.role === 'user') return html`<div class="msg user"><div class="msg-bubble">${msg.text}</div></div>`;
    // Format assistant message with code blocks
    const parts = msg.text.split('```');
    return html`<div class="msg assistant">
      <div class="assistant-header">
        <div class="assistant-av">AI</div>
        <span style="font-size:12px;color:var(--tx-2);font-weight:500">${MODELS.find(m=>m.id===this._model)?.name}</span>
      </div>
      <div class="msg-bubble">
        ${parts.map((p,i) => i%2===0 ? html`<span>${p.replace(/\*\*([^*]+)\*\*/g,'$1')}</span>` : html`<pre>${p.replace(/^python\n/,'')}</pre>`)}
      </div>
    </div>`;
  }

  override render() {
    return html`<div class="layout">
      <div class="model-bar">
        ${MODELS.map(m => html`<button class="model-btn ${this._model===m.id?'active':''}" @click=${()=>{this._model=m.id;this.requestUpdate();}}>
          <div class="model-dot" style="background:${m.color}"></div>${m.name}
        </button>`)}
      </div>

      <div class="messages">
        ${SAMPLE_MESSAGES.map(m => this._renderMsg(m))}
      </div>

      <div class="input-area">
        <div class="capabilities">
          ${['📎 Attach','🖼 Image','📊 Data','🌐 Search','💻 Code'].map(c => html`<button class="cap-chip">${c}</button>`)}
        </div>
        <div class="input-box">
          <textarea rows="1" placeholder="Ask anything..."
            .value=${this._input}
            @input=${(e:InputEvent)=>{this._input=(e.target as HTMLTextAreaElement).value;}}
            @keydown=${(e:KeyboardEvent)=>{ if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();}}}
          ></textarea>
          <button class="send"><svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg></button>
        </div>
      </div>
    </div>`;
  }
}
if (!customElements.get('ai-chat-page')) customElements.define('ai-chat-page', AIPage);
