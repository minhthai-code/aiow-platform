import type { FeatureModule, RouteParams } from '@core/types';
import { SearchService } from './services/search-service';
import { SearchStore }   from './state/search-store';
import './components/yt-search-page';

export const SearchFeature: FeatureModule = {
  displayName: 'Search',

  mount(container: HTMLElement, params: RouteParams) {
    const query = params['q'] ?? '';
    const store = new SearchStore(new SearchService());
    container.innerHTML = '';
    const el = document.createElement('yt-search-page') as HTMLElement & { store: SearchStore };
    el.store = store;
    container.appendChild(el);
    void store.search(query);
    return () => { container.innerHTML = ''; };
  },
};
