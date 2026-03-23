import type { Channel, Video } from '@core/types';
import { CHANNELS, VIDEOS } from '@libs/utils/mock-data';

export interface ChannelPayload { channel: Channel; videos: readonly Video[]; }

export class ChannelService {
  async fetch(channelId: string): Promise<ChannelPayload> {
    await new Promise(r => setTimeout(r, 200));
    const channel = CHANNELS.find(c => c.id === channelId) ?? CHANNELS[0]!;
    const videos  = VIDEOS.filter(v => v.channelId === channel.id)
                          .sort((a, b) => b.publishedAt - a.publishedAt);
    return { channel, videos };
  }
}
