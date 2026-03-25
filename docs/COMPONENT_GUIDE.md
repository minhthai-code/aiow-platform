# Component Library Guide

All reusable components are in `src/libs/components/`. Import and use like standard HTML elements.

---

## Button `<yt-button>`

```html
<yt-button variant="primary">Save</yt-button>
<yt-button variant="secondary">Cancel</yt-button>
<yt-button variant="ghost">Learn more</yt-button>
<yt-button variant="glass">Share</yt-button>
<yt-button size="icon">★</yt-button>
<yt-button disabled>Unavailable</yt-button>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `primary\|secondary\|ghost\|glass\|danger` | `secondary` | Visual style |
| `size` | `sm\|md\|icon` | `md` | Size preset |
| `disabled` | `boolean` | `false` | Disables interaction |

---

## Chip `<yt-chip>`

```html
<yt-chip label="All" active></yt-chip>
<yt-chip label="Tech"></yt-chip>
```

Emits `chip-click` CustomEvent on click.

---

## Input `<yt-input>`

```html
<yt-input placeholder="Search..." type="search"></yt-input>
```

Emits `yt-input` (on every keystroke) and `yt-enter` (on Enter key).

---

## Badge `<yt-badge>`

```html
<yt-badge count="12" variant="error"></yt-badge>
<yt-badge count="3"  variant="success"></yt-badge>
```

---

## Skeleton `<yt-skeleton>`

```html
<yt-skeleton width="100%" height="200px" radius="12px"></yt-skeleton>
<yt-skeleton width="36px" height="36px" circle></yt-skeleton>
```

---

## Context Menu `<yt-context-menu>`

```typescript
// In your component:
this._menuOpen = true;
this._menuX    = event.clientX;
this._menuY    = event.clientY;
```

```html
<yt-context-menu
  .open=${this._menuOpen}
  .x=${this._menuX}
  .y=${this._menuY}
  @close=${() => { this._menuOpen = false; }}
></yt-context-menu>
```

---

## Video Card `<yt-video-card>`

```html
<yt-video-card .video=${videoObject}></yt-video-card>
```

Emits:
- `video-click` → `{ videoId: string }`
- `channel-click` → `{ channelId: string }`

---

## Music Player `<yt-music-player>`

Auto-managed by the sidebar. No external API needed.
To pass track data in future: set `.playing`, `.progress` properties.

---

## Layout Components

These are managed by the app shell. You should not use them directly in feature code.

| Component | Description |
|-----------|-------------|
| `<yt-header>` | Top nav bar with search, theme toggle, language |
| `<yt-rail>` | Far-left icon switcher (64px) |
| `<yt-sidebar>` | Content nav (224px) with music player pinned at bottom |
| `<yt-app>` | App shell — assembles all layout pieces |

---

## Event Bus (Cross-Feature Communication)

```typescript
import { emit, on } from '@core/runtime-api/event-bus';

// Send an event
emit('auth:changed', { userId: '123', isAuthenticated: true });

// Listen to an event
const off = on('route:changed', (ctx) => {
  console.log('Navigated to', ctx.to);
});

// Clean up listener on component disconnect
override disconnectedCallback() {
  off();
}
```

**Available platform events:**

| Event | Payload | When |
|-------|---------|------|
| `auth:changed` | `AuthState` | Login/logout |
| `route:will-change` | `NavigationContext` | Before navigation |
| `route:changed` | `NavigationContext` | After navigation |
| `sidebar:toggled` | `{ collapsed: boolean }` | Sidebar toggle |
| `network:offline` | `{}` | Browser goes offline |
| `network:online` | `{}` | Browser comes back online |
