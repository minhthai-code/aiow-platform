import { LitElement, css, html } from 'lit';
import { SidebarBase } from './sidebar-base';

class AISecondarySidebar extends SidebarBase {
  static override styles = super.styles as any;

  override render() {
    const conversations = ['Debug my React app','Write unit tests','Explain transformers','SQL optimization','UI component ideas'];
    return html`
      <div class="scroller">
        <!-- AI Studio section -->
        <div class="section-header" @click=${() => this._toggleSection('aistudio')}>
          <span class="section-label">AI Studio</span>
          <div class="chevron ${this._collapsedSections.aistudio ? 'collapsed' : ''}">
            <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M7 10l5 5 5-5z"/></svg>
          </div>
        </div>
        <div class="section-content ${this._collapsedSections.aistudio ? 'collapsed' : ''}">
          <button class="item active" @click=${() => this._nav('/ai')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg> New Chat
          </button>
          <button class="item"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg> Templates</button>
          <button class="item"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z"/></svg> Saved</button>
        </div>

        <!-- Recent Chats section -->
        <div class="section-header" @click=${() => this._toggleSection('recent')}>
          <span class="section-label">Recent Chats</span>
          <div class="chevron ${this._collapsedSections.recent ? 'collapsed' : ''}">
            <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M7 10l5 5 5-5z"/></svg>
          </div>
        </div>
        <div class="section-content ${this._collapsedSections.recent ? 'collapsed' : ''}">
          ${conversations.map((c, i) => html`
            <button class="item ${i === 0 ? 'active' : ''}">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>
              <span style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0">${c}</span>
            </button>`)}
        </div>

        <!-- Models section -->
        <div class="section-header" @click=${() => this._toggleSection('models')}>
          <span class="section-label">Models</span>
          <div class="chevron ${this._collapsedSections.models ? 'collapsed' : ''}">
            <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M7 10l5 5 5-5z"/></svg>
          </div>
        </div>
        <div class="section-content ${this._collapsedSections.models ? 'collapsed' : ''}">
          ${['Claude Sonnet','GPT-4o','Gemini Pro','Llama 3'].map(m => html`
            <button class="item"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 1 1 0 20A10 10 0 0 1 12 2z"/></svg> ${m}</button>`)}
        </div>
      </div>
    `;
  }
}

if (!customElements.get('ai-secondary-sidebar')) customElements.define('ai-secondary-sidebar', AISecondarySidebar);

