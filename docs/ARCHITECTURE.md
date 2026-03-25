# Architecture Deep-Dive

This document explains *why* the platform is structured the way it is,
not just *what* the structure is. Read this if you want to understand
design decisions and constraints.

---

## Core Principle: Platform vs Product

The codebase is split into two zones:

```
Platform (core/ + platform/)    Product (features/)
────────────────────────────    ───────────────────
Owned by infra team             Owned by product teams
Slow-moving, stable API         Fast-moving, independent
Features depend on platform     Platform NEVER imports features
```

This boundary is enforced at the import level. If you ever write
`import something from '@features/watch'` inside `@features/home`,
CI will fail.

---

## The Scheduler (5 Priority Lanes)

Every UI update flows through the micro-scheduler in `src/core/scheduler/scheduler.ts`.

```
IMMEDIATE    → sync, inline (never queue)
USER-BLOCKING→ queueMicrotask (< 1ms)
USER-VISIBLE → requestAnimationFrame (next paint)
NORMAL       → MessageChannel (background task)
BACKGROUND   → requestIdleCallback (when browser is idle)
```

Why not just use `setTimeout(fn, 0)`?
`setTimeout` has a minimum 4ms delay capped by the spec. `MessageChannel`
fires a real macrotask with no artificial minimum. `requestIdleCallback`
with `{ timeout: 2000 }` ensures background tasks don't starve forever.

---

## Component Reactivity (No Decorators)

We do NOT use `@state()` or `@property()` decorators. Here's why:

Lit uses getter/setter pairs on the class prototype for reactivity.
TypeScript compiles class field initializers with `useDefineForClassFields: true`
(the ES2022 default), which emits native class field syntax. Native class
fields overwrite prototype setters — breaking Lit's reactivity silently.

**The fix** is using the `static properties` map which Lit processes
before class fields run:

```typescript
// ✅ Correct — works everywhere
static override properties = {
  loading: { type: Boolean },
};
loading = false;

// ❌ Broken with esbuild
@state() loading = false;
```

---

## Routing Architecture

```
NavigationController
    │
    ├── register(route)           ← called at boot
    ├── boot(outlet)              ← hands it the #outlet div
    └── push('/watch?v=abc')      ← triggers navigation
            │
            ├── parse path + query params
            ├── find matching route
            ├── abort previous navigation (AbortController)
            ├── prefetchOnHover(chunkId, loader)
            ├── show skeleton immediately
            ├── dynamic import(feature bundle)
            ├── ErrorBoundary.run(async () => feature.mount(outlet, params))
            ├── restore scroll position
            └── recordNavigation(from, to, durationMs) → telemetry
```

Query params (`?v=abc`, `?q=hello`) are parsed and merged into the
`params` object passed to `feature.mount()`. You don't need to read
`location.search` yourself.

---

## The Outlet Scroll Rule

**`#outlet` is the ONLY element in the entire app that scrolls.**

Everything else — the shell, rail, sidebar, header — is `overflow: hidden`.

Why? Competing scroll contexts cause:
- iOS Safari scroll-chaining bugs
- `position: sticky` not working (it needs a scrollable ancestor)
- Nested scroll jank
- Incorrect `scrollY` restoration on back-navigation

If you need something to scroll inside a feature, use `overflow-y: auto`
on a child element *inside* the outlet.

---

## Design Token Injection

Tokens are CSS custom properties injected into `:root` by `initTheme()` in bootstrap.

```
localStorage('yt-theme')
    or
prefers-color-scheme media query
    ↓
injectTokens('dark' | 'light')
    ↓
<style id="yt-tokens"> :root { --bg-base: ... } </style>  ← injected into <head>
    ↓
All components read var(--bg-base) — no JS needed at runtime
```

This means theme changes are instant (just update the `<style>` tag)
and components don't need JavaScript to read the current theme.

---

## Feature Store Pattern

```typescript
// Every feature follows this exact shape:

// 1. State interface (immutable)
interface FeatureState { ... }

// 2. Action union (discriminated)
type FeatureAction =
  | Action<Payload> & { type: 'ACTION_NAME' }
  | ...;

// 3. Pure reducer
function reducer(state: FeatureState, action: FeatureAction): FeatureState {
  switch (action.type) { ... }
}

// 4. Store class wrapping FeatureStore
class Store {
  private _store = new FeatureStore('feature-id', INITIAL, reducer);
  // Public methods dispatch actions — components never call reducer directly
  load()  { this._store.dispatch({ type: 'LOADING', ... }); }
}
```

FeatureStore maintains an **action log** with trace IDs for debugging.
In dev mode, every action is logged to the console with timing.

---

## Error Boundary Behaviour

Each feature is wrapped in an `ErrorBoundary`. If `feature.mount()` throws
(e.g. the bundle fails to parse, a component crashes on first render):

1. The shell, rail, sidebar, and header remain intact
2. Only the `#outlet` content shows the error UI
3. A retry button re-calls `feature.mount()`
4. The error is reported to telemetry with a `traceId`

This means a bug in the Watch feature cannot crash the Home feed.

---

## Telemetry Sampling

Telemetry is collected at **1% in production** to reduce overhead.
In dev mode, all events are sampled (printed to console, not sent).

Sensitive data rules:
- No user IDs in plain text — session IDs are random, not linked to accounts
- URLs are sanitized: only safe query params (`v`, `q`, `list`) are kept
- `sendBeacon` is used for page-unload delivery (not blocked by navigation)

---

## Bundle Splitting

Each feature is a separate dynamic `import()` chunk:

```
vendor-lit.js       ← Lit library (~18KB gzip)
platform-core.js    ← core/ + platform/ (~35KB)
libs.js             ← libs/components (~25KB)
feature-home.js     ← home feature, loaded on / (~15KB)
feature-watch.js    ← watch feature, loaded on /watch (~20KB)
feature-search.js   ← etc.
feature-channel.js  ← etc.
```

The router prefetches the next likely feature bundle on hover.
This means navigating from Home to Watch feels instant even on slow connections.
