import type { FeatureModule, RouteParams } from '@core/types';
import './components/marketplace-page';

export const MarketplaceFeature: FeatureModule = {
  displayName: 'MarketplaceFeature',
  mount(container: HTMLElement, _params: RouteParams) {
    container.innerHTML = '';
    container.appendChild(document.createElement('marketplace-page'));
    return () => { container.innerHTML = ''; };
  },
};
