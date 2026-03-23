import type { RouteDefinition } from '@core/types';

export const youtubeRoutes: RouteDefinition[] = [
  {
    path: '/videos',
    chunkId: 'feature-home',
    priority: 'critical',
    load: () => import('@features/home').then(m => m.HomeFeature),
  },
  {
    path: '/',
    chunkId: 'feature-home',
    priority: 'critical',
    load: () => import('@features/home').then(m => m.HomeFeature),
  },
  {
    path: '/watch',
    chunkId: 'feature-watch',
    priority: 'critical',
    load: () => import('@features/watch').then(m => m.WatchFeature),
  },
  {
    path: '/search',
    chunkId: 'feature-search',
    priority: 'normal',
    load: () => import('@features/search').then(m => m.SearchFeature),
  },
  {
    path: '/channel/:channelId',
    chunkId: 'feature-channel',
    priority: 'normal',
    load: () => import('@features/channel').then(m => m.ChannelFeature),
  },
  {
    path: '/social',
    chunkId: 'feature-facebook-feed',
    priority: 'normal',
    load: () => import('@features/facebook-feed').then(m => m.FacebookFeedFeature),
  },
  {
    path: '/chat',
    chunkId: 'feature-discord-server',
    priority: 'normal',
    load: () => import('@features/discord-server').then(m => m.DiscordServerFeature),
  },
  {
    path: '/music',
    chunkId: 'feature-spotify-home',
    priority: 'normal',
    load: () => import('@features/spotify-home').then(m => m.SpotifyHomeFeature),
  },
  {
    path: '/streaming',
    chunkId: 'feature-netflix-home',
    priority: 'normal',
    load: () => import('@features/netflix-home').then(m => m.NetflixHomeFeature),
  },
  {
    path: '/professional',
    chunkId: 'feature-professional',
    priority: 'normal',
    load: () => import('@features/professional').then(m => m.ProfessionalFeature),
  },
  {
    path: '/ai',
    chunkId: 'feature-ai',
    priority: 'normal',
    load: () => import('@features/ai-assistant').then(m => m.AIFeature),
  },
  {
    path: '/learning',
    chunkId: 'feature-learning',
    priority: 'normal',
    load: () => import('@features/learning').then(m => m.LearningFeature),
  },
  {
    path: '/shopping',
    chunkId: 'feature-shopping',
    priority: 'normal',
    load: () => import('@features/shopping').then(m => m.ShoppingFeature),
  },
  {
    path: '/marketplace',
    chunkId: 'feature-marketplace',
    priority: 'normal',
    load: () => import('@features/marketplace').then(m => m.MarketplaceFeature),
  },
  {
    path: '/maps',
    chunkId: 'feature-maps',
    priority: 'normal',
    load: () => import('@features/maps').then(m => m.MapsFeature),
  },
  {
    path: '/transport',
    chunkId: 'feature-transport',
    priority: 'normal',
    load: () => import('@features/transport').then(m => m.TransportFeature),
  },
  {
    path: '/login',
    chunkId: 'feature-auth',
    priority: 'normal',
    load: () => import('@features/auth').then(m => m.AuthFeature),
  },
  {
    path: '/register',
    chunkId: 'feature-auth',
    priority: 'normal',
    load: () => import('@features/auth').then(m => m.AuthFeature),
  },
];
