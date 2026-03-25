import type { FeatureModule, RouteParams } from '@core/types';
import { HomeService } from './services/home-service';
import { HomeStore }   from './state/home-store';
import './components/yt-home-page';

export const HomeFeature: FeatureModule = {
  displayName: 'Home',

  mount(container: HTMLElement, _params: RouteParams) {
    const store = new HomeStore(new HomeService());
    container.innerHTML = '';
    const el = document.createElement('yt-home-page') as HTMLElement & { store: HomeStore };
    el.store = store;
    container.appendChild(el);
    void store.loadFeed();
    return () => { container.innerHTML = ''; };
  },
};
