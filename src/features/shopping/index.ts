import type { FeatureModule, RouteParams } from '@core/types';
import './components/shopping-page';

export const ShoppingFeature: FeatureModule = {
  displayName: 'ShoppingFeature',
  mount(container: HTMLElement, _params: RouteParams) {
    container.innerHTML = '';
    container.appendChild(document.createElement('shopping-page'));
    return () => { container.innerHTML = ''; };
  },
};
