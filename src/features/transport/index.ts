import type { FeatureModule, RouteParams } from '@core/types';
import './components/transport-page';

export const TransportFeature: FeatureModule = {
  displayName: 'TransportFeature',
  mount(container: HTMLElement, _params: RouteParams) {
    container.innerHTML = '';
    container.appendChild(document.createElement('transport-page'));
    return () => { container.innerHTML = ''; };
  },
};
