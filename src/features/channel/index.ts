import type { FeatureModule, RouteParams } from '@core/types';
import { ChannelService } from './services/channel-service';
import { ChannelStore }   from './state/channel-store';
import './components/yt-channel-page';

export const ChannelFeature: FeatureModule = {
  displayName: 'Channel',

  mount(container: HTMLElement, params: RouteParams) {
    const channelId = params['channelId'] ?? 'c1';
    const store     = new ChannelStore(new ChannelService());
    container.innerHTML = '';
    const el = document.createElement('yt-channel-page') as HTMLElement & { store: ChannelStore };
    el.store = store;
    container.appendChild(el);
    void store.load(channelId);
    return () => { container.innerHTML = ''; };
  },
};
