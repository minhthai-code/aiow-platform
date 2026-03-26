// Lazy sidebar loader — each sidebar is its own chunk, loaded only when needed.
// Import this instead of the old platform-secondary-sidebars.ts.

import type { PlatformSidebarId } from '@platform/runtime/platform-sidebar-controller';

const SIDEBAR_LOADERS: Record<PlatformSidebarId, () => Promise<unknown>> = {
  ytube:        () => import('./yt-sidebar'),
  facebook:     () => import('./fb-sidebar'),
  discord:      () => import('./discord-sidebar'),
  spotify:      () => import('./spotify-sidebar'),
  netflix:      () => import('./netflix-sidebar'),
  professional: () => import('./professional-sidebar'),
  ai:           () => import('./ai-sidebar'),
  learning:     () => import('./learning-sidebar'),
  shopping:     () => import('./shopping-sidebar'),
  marketplace:  () => import('./marketplace-sidebar'),
  maps:         () => import('./maps-sidebar'),
  transport:    () => import('./transport-sidebar'),
  auth:         () => import('./auth-sidebar'),
};

const _loaded = new Set<PlatformSidebarId>();

/** Call this before rendering a platform's sidebar to ensure its chunk is loaded. */
export async function loadSidebar(platform: PlatformSidebarId): Promise<void> {
  if (_loaded.has(platform)) return;
  _loaded.add(platform);
  await SIDEBAR_LOADERS[platform]();
}

