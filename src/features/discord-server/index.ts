import type { FeatureModule, RouteParams } from '@core/types';
import './components/discord-server-page';

export const DiscordServerFeature: FeatureModule = {
  displayName: 'DiscordServer',
  mount(container: HTMLElement, _params: RouteParams) {
    container.innerHTML = '';
    container.appendChild(document.createElement('discord-server-page'));
    return () => { container.innerHTML = ''; };
  },
};

