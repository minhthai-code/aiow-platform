import { registerProduct } from '@platform/runtime/route-registry';
import { youtubeRoutes } from './routes';
import { YoutubeApp } from './app';

registerProduct({
  id: YoutubeApp.id,
  displayName: YoutubeApp.displayName,
  routes: youtubeRoutes,
});

