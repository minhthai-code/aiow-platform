import type { FeatureModule, RouteParams } from '@core/types';
import './components/learning-page';

export const LearningFeature: FeatureModule = {
  displayName: 'LearningFeature',
  mount(container: HTMLElement, _params: RouteParams) {
    container.innerHTML = '';
    container.appendChild(document.createElement('learning-page'));
    return () => { container.innerHTML = ''; };
  },
};
