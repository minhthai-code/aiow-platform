import { LitElement, css, html } from 'lit';

export abstract class SidebarBase extends LitElement {
  static override styles = [
    css`
      :host {
        display: flex;
        flex-direction: column;
        width: var(--sidebar-w, 260px);
        height: 100%;
        background: var(--sidebar-bg, #0d0d0d);
        overflow: hidden;
        flex-shrink: 0;
        font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'SF Pro Display', 'Inter', system-ui, sans-serif;
      }

      .scroller {
        flex: 1;
        overflow-y: auto;
        overflow-x: hidden;
        padding: 20px 12px 24px;
        scrollbar-width: none;
        -ms-overflow-style: none;
      }
      .scroller::-webkit-scrollbar {
        display: none;
      }

      /* Section header with chevron */
      .section-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 12px 12px 8px;
        cursor: pointer;
        user-select: none;
        transition: all 0.2s cubic-bezier(0.2, 0.9, 0.4, 1.1);
        border-radius: 8px;
        margin: 4px 0;
      }
      .section-header:hover {
        background: rgba(255, 255, 255, 0.03);
      }
      .section-label {
        font-size: 10px;
        font-weight: 600;
        letter-spacing: 0.5px;
        text-transform: uppercase;
        color: #8e8e93;
      }
      .chevron {
        width: 16px;
        height: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: transform 0.25s cubic-bezier(0.2, 0.9, 0.4, 1.1);
        color: #8e8e93;
      }
      .chevron.collapsed {
        transform: rotate(-90deg);
      }
      .section-content {
        overflow: hidden;
        transition: max-height 0.25s cubic-bezier(0.2, 0.9, 0.4, 1.1);
        max-height: 1000px;
      }
      .section-content.collapsed {
        max-height: 0;
      }

      /* Navigation items – Apple style */
      .item {
        display: flex;
        align-items: center;
        gap: 14px;
        width: 100%;
        padding: 9px 12px;
        margin: 3px 0;
        border-radius: 10px;
        border: none;
        background: transparent;
        color: #e5e5ea;
        font-size: 12px;
        font-weight: 450;
        font-family: inherit;
        text-align: left;
        cursor: pointer;
        transition: all 0.2s cubic-bezier(0.2, 0, 0, 1);
        position: relative;
      }
      .item svg {
        flex-shrink: 0;
        width: 20px;
        height: 20px;
        opacity: 0.75;
        transition: opacity 0.2s, transform 0.2s;
      }
      .item:hover {
        background: rgba(255, 255, 255, 0.05);
        color: #ffffff;
      }
      .item:hover svg {
        opacity: 1;
        transform: scale(1.04);
      }
      .item.active {
        background: rgba(255, 255, 255, 0.08);
        color: #ffffff;
        font-weight: 500;
      }
      .item.active::before {
        content: '';
        position: absolute;
        left: -8px;
        top: 50%;
        transform: translateY(-50%);
        width: 3px;
        height: 24px;
        background: #ff3b30;
        border-radius: 3px;
      }
      .item.active svg {
        opacity: 1;
      }

      /* Apple-style circular notification badge */
      .notification-badge {
        margin-left: auto;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 14px;
        height: 14px;
        background: #ff3b30;
        color: #ffffff;
        font-size: 9px;
        font-weight: 600;
        font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', system-ui;
        border-radius: 50%;
        line-height: 1;
        letter-spacing: -0.2px;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        flex-shrink: 0;
      }

      /* For numbers larger than 9, adjust slightly */
      .notification-badge.large {
        width: auto;
        min-width: 14px;
        padding: 0 3px;
        border-radius: 8px;
      }

      /* Dot indicator for subtle notifications */
      .dot-indicator {
        margin-left: auto;
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: #ff3b30;
        box-shadow: 0 0 0 1px rgba(255, 59, 48, 0.2);
      }

      /* Channel avatar */
      .ch-av {
        width: 28px;
        height: 28px;
        border-radius: 50%;
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 11px;
        font-weight: 600;
        color: #fff;
        transition: transform 0.2s;
      }
      .item:hover .ch-av {
        transform: scale(1.02);
      }

      /* Active state animation */
      @keyframes subtleSlide {
        from {
          opacity: 0;
          transform: translateX(-4px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }
      .item.active {
        animation: subtleSlide 0.2s ease;
      }
    `
  ];

  static override properties = {
    _collapsedSections: { type: Object, state: true }
  };

  protected _collapsedSections: Record<string, boolean> = {};

  protected _toggleSection(section: string) {
    this._collapsedSections = {
      ...this._collapsedSections,
      [section]: !this._collapsedSections[section]
    };
    this.requestUpdate();
  }

  protected _nav(path: string) {
    this.dispatchEvent(new CustomEvent('navigate', { detail: path, bubbles: true, composed: true }));
  }

  protected _active(path: string) {
    return location.pathname === path || (path !== '/' && location.pathname.startsWith(path));
  }
}

