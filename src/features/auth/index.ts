import type { FeatureModule, RouteParams } from '@core/types';
import './components/auth-page';

export const AuthFeature: FeatureModule = {
  displayName: 'AuthFeature',
  mount(container: HTMLElement, _params: RouteParams) {
    container.innerHTML = '';
    container.appendChild(document.createElement('auth-page'));
    return () => { container.innerHTML = ''; };
  },
};
