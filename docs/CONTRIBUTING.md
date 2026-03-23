# Contributing Guide — YTube Platform

Welcome to the team. This document tells you everything you need to know to contribute
to this codebase without breaking anything, even on your first day.

---

## Table of Contents

1. [One-Time Setup](#1-one-time-setup)
2. [Running the Dev Server](#2-running-the-dev-server)
3. [Project Structure — Where Does What Live?](#3-project-structure)
4. [How to Add a New Feature Page](#4-adding-a-feature-page)
5. [How to Add a New Reusable Component](#5-adding-a-reusable-component)
6. [Design Tokens — Never Hard-Code Colours](#6-design-tokens)
7. [State Management Rules](#7-state-management)
8. [TypeScript Rules](#8-typescript-rules)
9. [Git Workflow](#9-git-workflow)
10. [Common Mistakes to Avoid](#10-common-mistakes)
11. [Getting Help](#11-getting-help)

---

## 1. One-Time Setup

```bash
# Requires Node.js 20+
node -v          # should print v20.x.x or higher

git clone <repo-url>
cd ytube-platform
npm install
```

You're done. No database, no backend, no environment variables needed for local dev.

---

## 2. Running the Dev Server

```bash
npm run dev        # starts at http://localhost:5173 — hot-reload enabled
npm run typecheck  # run TypeScript type checks without building
npm run build      # production build into dist/
npm run preview    # serve the dist/ build locally
```

When you save a `.ts` file, the browser updates in ~100ms. You do not need to restart anything.

---

## 3. Project Structure

```
src/
├── core/          ← Platform runtime. DO NOT edit unless you own the platform.
├── platform/      ← Shared services (API, auth, telemetry). Usually don't touch.
├── libs/          ← Shared components and utilities. Safe to read; careful to edit.
│   ├── tokens/    ← All colours, spacing, motion. Edit here, not inline.
│   └── components/
│       ├── base/    ← Atoms: Button, Chip, Input, Badge
│       ├── layout/  ← Shell: Header, Sidebar, Rail
│       ├── media/   ← VideoCard, Thumbnail
│       ├── controls/← MusicPlayer
│       └── feedback/← Skeleton, ContextMenu
└── features/      ← Your territory. Each team owns one folder.
    ├── home/
    ├── watch/
    ├── search/
    └── channel/
```

**Rule:** `features/` code MUST NOT import from other `features/` folders.
Cross-feature communication happens via the event bus (`@core/runtime-api/event-bus`).

---

## 4. Adding a Feature Page

Say you need to add a `/trending` route.

### Step 1 — Create the folder structure

```
src/features/trending/
  index.ts                  ← mount/unmount contract (required)
  components/
    yt-trending-page.ts     ← the page component
  services/
    trending-service.ts     ← data fetching
  state/
    trending-store.ts       ← feature state
```

### Step 2 — Write the store

```typescript
// src/features/trending/state/trending-store.ts
import { FeatureStore } from '@core/runtime-api/feature-store';
import type { Video, Action } from '@core/types';
import type { TrendingService } from '../services/trending-service';

export interface TrendingState {
  videos:  readonly Video[];
  loading: boolean;
  error:   string | null;
}

const INITIAL: TrendingState = { videos: [], loading: true, error: null };

type TrendingAction =
  | Action<{ videos: readonly Video[] }> & { type: 'LOADED' }
  | Action<null>                          & { type: 'LOADING' }
  | Action<{ error: string }>             & { type: 'ERROR' };

function reducer(s: TrendingState, a: TrendingAction): TrendingState {
  switch (a.type) {
    case 'LOADING': return { ...s, loading: true,  error: null };
    case 'LOADED':  return { ...s, loading: false, videos: a.payload.videos };
    case 'ERROR':   return { ...s, loading: false, error: a.payload.error };
    default:        return s;
  }
}

export class TrendingStore {
  private readonly _store: FeatureStore<TrendingState, TrendingAction>;
  private readonly _svc:   TrendingService;

  constructor(svc: TrendingService) {
    this._svc   = svc;
    this._store = new FeatureStore('trending', INITIAL, reducer);
  }

  getState()  { return this._store.getState(); }
  subscribe(fn: (s: TrendingState) => void) { return this._store.subscribe(s => fn(s)); }

  async load(): Promise<void> {
    this._store.dispatch({ type: 'LOADING', payload: null });
    try {
      const videos = await this._svc.fetchTrending();
      this._store.dispatch({ type: 'LOADED', payload: { videos } });
    } catch (err) {
      this._store.dispatch({ type: 'ERROR', payload: { error: String(err) } });
    }
  }
}
```

### Step 3 — Write the page component

```typescript
// src/features/trending/components/yt-trending-page.ts
import { LitElement, html, css } from 'lit';
import type { TrendingStore, TrendingState } from '../state/trending-store';

export class YtTrendingPage extends LitElement {
  static override properties = {
    store: { type: Object, attribute: false },
    _st:   { type: Object, state: true },
  };

  store!: TrendingStore;
  private _st!: TrendingState;
  private _unsub?: () => void;

  override connectedCallback(): void {
    super.connectedCallback();
    this._st    = this.store.getState();
    this._unsub = this.store.subscribe(s => { this._st = s; this.requestUpdate(); });
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this._unsub?.();
  }

  static override styles = css`
    :host { display: block; padding: 20px; }
  `;

  override render() {
    if (!this._st) return html``;
    if (this._st.loading) return html`<p>Loading…</p>`;
    return html`<p>${this._st.videos.length} videos</p>`;
  }
}

if (!customElements.get('yt-trending-page'))
  customElements.define('yt-trending-page', YtTrendingPage);
```

### Step 4 — Write the index (feature contract)

```typescript
// src/features/trending/index.ts
import type { FeatureModule, RouteParams } from '@core/types';
import { TrendingService } from './services/trending-service';
import { TrendingStore }   from './state/trending-store';
import './components/yt-trending-page';

export const TrendingFeature: FeatureModule = {
  displayName: 'Trending',
  mount(container: HTMLElement, _params: RouteParams) {
    const store = new TrendingStore(new TrendingService());
    container.innerHTML = '';
    const el = document.createElement('yt-trending-page') as HTMLElement & { store: TrendingStore };
    el.store = store;
    container.appendChild(el);
    void store.load();
    return () => { container.innerHTML = ''; };
  },
};
```

### Step 5 — Register the route in bootstrap

Open `src/core/bootstrap/bootstrap.ts` and add one line:

```typescript
router.register({
  path: '/trending',
  chunkId: 'feature-trending',
  priority: 'normal',
  load: () => import('@features/trending').then(m => m.TrendingFeature),
});
```

Done. Navigate to `/trending` and your page renders.

---

## 5. Adding a Reusable Component

Reusable components live in `src/libs/components/`. Pick the right sub-folder:

| Folder | Use for |
|--------|---------|
| `base/` | Pure atoms with no business logic (Button, Chip, Input, Badge, Avatar) |
| `media/` | Content display (VideoCard, Thumbnail, ChannelBadge) |
| `controls/` | Interactive controls (Player, VolumeSlider, Toggle) |
| `feedback/` | Loading/error states (Skeleton, Toast, ContextMenu) |
| `layout/` | Shell structure (Header, Sidebar, Rail) |

**Template:**

```typescript
// src/libs/components/base/yt-avatar.ts
import { LitElement, html, css } from 'lit';

export class YtAvatar extends LitElement {
  // 1. Declare properties using static map (not decorators)
  static override properties = {
    src:     { type: String },
    initials:{ type: String },
    size:    { type: Number },
  };

  static override styles = css`
    :host { display: inline-block; }
    .av {
      border-radius: 50%;
      width: var(--av-size, 36px);
      height: var(--av-size, 36px);
      background: var(--bg-raised, #171717);
      display: flex; align-items: center; justify-content: center;
      color: var(--tx-1, #f2f2f2);
      font-size: 13px; font-weight: 700;
      overflow: hidden;
    }
  `;

  src      = '';
  initials = '?';
  size     = 36;

  override render() {
    return html`
      <div class="av" style="--av-size:${this.size}px">
        ${this.src
          ? html`<img src="${this.src}" alt="" width="${this.size}" height="${this.size}">`
          : this.initials}
      </div>
    `;
  }
}

// 2. Always guard with get() to prevent double-registration
if (!customElements.get('yt-avatar'))
  customElements.define('yt-avatar', YtAvatar);
```

---

## 6. Design Tokens

**Never hard-code colours, spacing, or motion values.** Always use CSS custom properties.

All tokens are defined in `src/libs/tokens/tokens.ts` and injected as CSS variables.

```css
/* ❌ Wrong */
background: #171717;
color: #f2f2f2;
transition: 0.1s ease;

/* ✅ Correct */
background: var(--bg-raised, #171717);     /* fallback for safety */
color: var(--tx-1, #f2f2f2);
transition: background var(--dur-fast) var(--ease);
```

**Key tokens to know:**

| Token | Value (dark) | Purpose |
|-------|-------------|---------|
| `--bg-base` | `#090909` | Deepest background |
| `--bg-raised` | `#171717` | Cards, chips |
| `--bg-overlay` | `#1e1e1e` | Hover state fill |
| `--tx-1` | `#f2f2f2` | Primary text |
| `--tx-2` | `#8a8a8a` | Secondary text |
| `--tx-3` | `#4a4a4a` | Muted/placeholder |
| `--brand` | `#ff0000` | YTube red |
| `--bd-1` | `rgba(255,255,255,0.08)` | Subtle border |
| `--bd-2` | `rgba(255,255,255,0.14)` | Normal border |
| `--dur-fast` | `80ms` | Quick transitions |
| `--dur-mid` | `180ms` | Normal transitions |
| `--r-sm` | `8px` | Small radius (chips, buttons) |
| `--r-lg` | `16px` | Large radius (cards) |
| `--r-full` | `9999px` | Pill shape |

---

## 7. State Management

Every feature has its own isolated store. The pattern is:

```
dispatch(action) → reducer(state, action) → new state → subscribers notified → component re-renders
```

**Rules:**
1. **Never mutate state directly.** Always return a new object from the reducer.
2. **One store per feature.** Don't share stores between features.
3. **Services fetch data; stores hold data.** Keep them separate.
4. **Optimistic updates** — dispatch the success state first, then roll back on error:

```typescript
// Good: optimistic like toggle
toggleLike(): void {
  const liked = !this._store.getState().liked;
  this._store.dispatch({ type: 'SET_LIKED', payload: liked });  // instant UI
  this._svc.sendLike(this._videoId, liked).catch(() => {
    this._store.dispatch({ type: 'SET_LIKED', payload: !liked }); // rollback
  });
}
```

---

## 8. TypeScript Rules

- `strict: true` is enabled. No `any`, no `@ts-ignore`.
- Use `override` keyword on all LitElement lifecycle methods.
- Use `import type { ... }` for type-only imports — helps tree-shaking.
- Put all shared interfaces in `src/core/types/index.ts`.

---

## 9. Git Workflow

```
main      ← always deployable, protected
develop   ← integration branch
feat/*    ← new features
fix/*     ← bug fixes
chore/*   ← non-functional changes
```

```bash
git checkout develop
git pull
git checkout -b feat/my-feature

# ... make changes ...

git add -p                        # review every hunk
git commit -m "feat(home): add trending filter chip"
git push origin feat/my-feature
# open PR against develop
```

**Commit message format:** `type(scope): short description`
Types: `feat`, `fix`, `chore`, `docs`, `refactor`, `perf`, `test`

---

## 10. Common Mistakes

| Mistake | Why it's bad | Fix |
|---------|-------------|-----|
| Using `@state()` or `@property()` decorators | Breaks with esbuild (class fields shadowing) | Use `static override properties = { ... }` map instead |
| Hard-coding `#171717` | Breaks light mode | Use `var(--bg-raised, #171717)` |
| `import from '@features/watch'` inside `features/home/` | Creates feature coupling | Use event bus: `emit('watch:play', { videoId })` |
| Forgetting `if (!customElements.get('yt-foo'))` guard | Double-definition error on HMR | Always wrap `customElements.define` with the guard |
| Adding `overflow: hidden` to `#outlet` | Breaks page scrolling | Outlet must be `overflow-y: auto` — never hidden |
| Putting business logic in components | Hard to test | Logic in stores/services; components are pure render |

---

## 11. Getting Help

- **Something broken?** Check browser console first. All errors include a `traceId`.
- **Design question?** All tokens and components are in `src/libs/`.
- **Architecture question?** Read `docs/ARCHITECTURE.md`.
- **Still stuck?** Ping the platform team in Slack `#platform-help`.
