import type { FeatureModule, RouteParams } from '@core/types';
import './components/netflix-home-page';

export const NetflixHomeFeature: FeatureModule = {
  displayName: 'NetflixHome',
  mount(container: HTMLElement, _params: RouteParams) {
    container.innerHTML = '';
    container.appendChild(document.createElement('netflix-home-page'));
    return () => { container.innerHTML = ''; };
  },
};

