import type { FeatureModule, RouteParams } from '@core/types';
import './components/fb-feed-page';

export const FacebookFeedFeature: FeatureModule = {
  displayName: 'FacebookFeed',
  mount(container: HTMLElement, _params: RouteParams) {
    container.innerHTML = '';
    container.appendChild(document.createElement('fb-feed-page'));
    return () => { container.innerHTML = ''; };
  },
};

