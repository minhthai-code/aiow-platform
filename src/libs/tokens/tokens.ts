/**
 * Design token system — single source of truth.
 * Tokens are injected as CSS custom properties on :root.
 * ALL components use var(--token) — never hard-code colours.
 *
 * Theme switching:
 *   injectTokens('dark' | 'light') → rewrites <style id="yt-tokens">
 *   toggleTheme() → flips and persists to localStorage
 *   initTheme()   → reads localStorage → prefers-color-scheme fallback
 */

export const DARK_TOKENS = `
  --brand:       #ff0000;
  --brand-dim:   rgba(255,0,0,0.15);
  --brand-glow:  rgba(255,0,0,0.35);

  --bg-base:     #090909;
  --bg-surface:  #101010;
  --bg-raised:   #1c1c1c;
  --bg-overlay:  #252525;
  --bg-hover:    rgba(255,255,255,0.07);
  --bg-active:   rgba(255,255,255,0.11);

  --glass-bg:    rgba(255,255,255,0.06);
  --glass-border:rgba(255,255,255,0.11);
  --glass-blur:  12px;

  --tx-1:  #f0f0f0;
  --tx-2:  #888888;
  --tx-3:  #444444;
  --tx-inv:#0a0a0a;

  --bd-1:  rgba(255,255,255,0.09);
  --bd-2:  rgba(255,255,255,0.16);
  --bd-3:  rgba(255,255,255,0.26);

  --shadow-sm: 0 1px 3px rgba(0,0,0,0.5);
  --shadow-md: 0 4px 16px rgba(0,0,0,0.6);
  --shadow-lg: 0 8px 32px rgba(0,0,0,0.7);

  --rail-glow:     rgba(200,50,30,0.40);
  --sidebar-bg:    #0d0d0d;
  --sidebar-bd:    rgba(255,255,255,0.09);
  --chip-bg:       #1c1c1c;
  --chip-border:   rgba(255,255,255,0.09);
  --chip-tx:       rgba(255,255,255,0.48);
  --chip-hover-bg: #252525;
  --chip-hover-bd: rgba(255,255,255,0.16);
  --chip-hover-tx: rgba(255,255,255,0.88);

  --header-bg:     #090909;
  --header-border: rgba(255,255,255,0.08);
  --input-bg:      #1c1c1c;
  --input-border:  rgba(255,255,255,0.09);
  --btn-bg:        #1c1c1c;
  --btn-border:    rgba(255,255,255,0.09);
  --btn-tx:        rgba(255,255,255,0.55);
  --btn-hover-bg:  #252525;
  --btn-hover-tx:  #f0f0f0;
  --pill-bg:       #1c1c1c;
  --pill-border:   rgba(255,255,255,0.09);
  --icon-tx:       rgba(255,255,255,0.55);
  --icon-hover-tx: #f0f0f0;
  --scrollbar-thumb: rgba(255,255,255,0.15);
  --scrollbar-hover: rgba(255,255,255,0.28);
`;

export const LIGHT_TOKENS = `
  --brand:       #cc0000;
  --brand-dim:   rgba(204,0,0,0.12);
  --brand-glow:  rgba(204,0,0,0.28);

  --bg-base:     #f5f5f5;
  --bg-surface:  #ffffff;
  --bg-raised:   #e8e8e8;
  --bg-overlay:  #dedede;
  --bg-hover:    rgba(0,0,0,0.06);
  --bg-active:   rgba(0,0,0,0.10);

  --glass-bg:    rgba(255,255,255,0.70);
  --glass-border:rgba(0,0,0,0.10);
  --glass-blur:  16px;

  --tx-1:  #111111;
  --tx-2:  #505050;
  --tx-3:  #909090;
  --tx-inv:#f5f5f5;

  --bd-1:  rgba(0,0,0,0.10);
  --bd-2:  rgba(0,0,0,0.18);
  --bd-3:  rgba(0,0,0,0.28);

  --shadow-sm: 0 1px 3px rgba(0,0,0,0.10);
  --shadow-md: 0 4px 16px rgba(0,0,0,0.12);
  --shadow-lg: 0 8px 32px rgba(0,0,0,0.15);

  --rail-glow:     rgba(180,20,10,0.20);
  --sidebar-bg:    #ebebeb;
  --sidebar-bd:    rgba(0,0,0,0.10);
  --chip-bg:       #dcdcdc;
  --chip-border:   rgba(0,0,0,0.10);
  --chip-tx:       rgba(0,0,0,0.52);
  --chip-hover-bg: #cfcfcf;
  --chip-hover-bd: rgba(0,0,0,0.18);
  --chip-hover-tx: #111111;

  --header-bg:     #f5f5f5;
  --header-border: rgba(0,0,0,0.09);
  --input-bg:      #e8e8e8;
  --input-border:  rgba(0,0,0,0.10);
  --btn-bg:        #e0e0e0;
  --btn-border:    rgba(0,0,0,0.10);
  --btn-tx:        rgba(0,0,0,0.55);
  --btn-hover-bg:  #d4d4d4;
  --btn-hover-tx:  #111111;
  --pill-bg:       #e0e0e0;
  --pill-border:   rgba(0,0,0,0.10);
  --icon-tx:       rgba(0,0,0,0.50);
  --icon-hover-tx: #111111;
  --scrollbar-thumb: rgba(0,0,0,0.20);
  --scrollbar-hover: rgba(0,0,0,0.38);
`;

export const STATIC_TOKENS = `
  --rail-w:    47px;
  --sidebar-w: 164px;
  --header-h:  41px;
  --r-xs:  4px; --r-sm: 8px; --r-md: 12px;
  --r-lg: 16px; --r-xl: 20px; --r-2xl: 24px; --r-full: 9999px;
  --ease:        cubic-bezier(0.4,0,0.2,1);
  --ease-spring: cubic-bezier(0.34,1.56,0.64,1);
  --ease-out:    cubic-bezier(0,0,0.2,1);
  --dur-fast: 80ms; --dur-mid: 180ms; --dur-slow: 300ms;
  --font:      'Inter', system-ui, -apple-system, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
  --z-base: 0; --z-raised: 10; --z-sticky: 100;
  --z-header: 200; --z-overlay: 300; --z-modal: 400; --z-toast: 500;
`;

export function injectTokens(theme: 'dark' | 'light' = 'dark'): void {
  let el = document.getElementById('yt-tokens');
  if (!el) {
    el = document.createElement('style');
    el.id = 'yt-tokens';
    document.head.prepend(el);
  }
  el.textContent = `:root { ${STATIC_TOKENS} ${theme === 'dark' ? DARK_TOKENS : LIGHT_TOKENS} }`;
  document.documentElement.setAttribute('data-theme', theme);
  // Force body background sync
  document.body.style.background = theme === 'dark' ? '#090909' : '#f5f5f5';
  document.body.style.color      = theme === 'dark' ? '#f0f0f0' : '#111111';
}

export function getTheme(): 'dark' | 'light' {
  return (document.documentElement.getAttribute('data-theme') as 'dark' | 'light') ?? 'dark';
}

export function toggleTheme(): 'dark' | 'light' {
  const next = getTheme() === 'dark' ? 'light' : 'dark';
  injectTokens(next);
  localStorage.setItem('yt-theme', next);
  return next;
}

export function initTheme(): void {
  const saved = localStorage.getItem('yt-theme') as 'dark' | 'light' | null;
  const sys   = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  injectTokens(saved ?? sys);
}
