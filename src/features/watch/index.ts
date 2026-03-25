import type { FeatureModule, RouteParams } from '@core/types';
import { WatchService } from './services/watch-service';
import { WatchStore }   from './state/watch-store';
import './components/yt-watch-page';

export const WatchFeature: FeatureModule = {
  displayName: 'Watch',

  mount(container: HTMLElement, params: RouteParams) {
    const videoId = params['v'] ?? params['videoId'] ?? '';
    const store   = new WatchStore(new WatchService());
    container.innerHTML = '';
    const el = document.createElement('yt-watch-page') as HTMLElement & { store: WatchStore };
    el.store = store;
    container.appendChild(el);
    void store.load(videoId);
    return () => { container.innerHTML = ''; };
  },
};
