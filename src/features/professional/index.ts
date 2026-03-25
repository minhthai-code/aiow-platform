import type { FeatureModule, RouteParams } from '@core/types';
import './components/professional-page';

export const ProfessionalFeature: FeatureModule = {
  displayName: 'ProfessionalFeature',
  mount(container: HTMLElement, _params: RouteParams) {
    container.innerHTML = '';
    container.appendChild(document.createElement('professional-page'));
    return () => { container.innerHTML = ''; };
  },
};
