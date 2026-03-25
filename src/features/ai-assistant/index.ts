import type { FeatureModule, RouteParams } from '@core/types';
import './components/ai-page';

export const AIFeature: FeatureModule = {
  displayName: 'AIFeature',
  mount(container: HTMLElement, _params: RouteParams) {
    container.innerHTML = '';
    container.appendChild(document.createElement('ai-chat-page'));
    return () => { container.innerHTML = ''; };
  },
};
