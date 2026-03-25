import type { FeatureModule, RouteParams } from '@core/types';
import './components/maps-page';

export const MapsFeature: FeatureModule = {
  displayName: 'MapsFeature',
  mount(container: HTMLElement, _params: RouteParams) {
    container.innerHTML = '';
    container.appendChild(document.createElement('maps-page'));
    return () => { container.innerHTML = ''; };
  },
};
