import type { FeatureModule, RouteParams } from '@core/types';
import './components/spotify-home-page';

export const SpotifyHomeFeature: FeatureModule = {
  displayName: 'SpotifyHome',
  mount(container: HTMLElement, _params: RouteParams) {
    container.innerHTML = '';
    container.appendChild(document.createElement('spotify-home-page'));
    return () => { container.innerHTML = ''; };
  },
};

