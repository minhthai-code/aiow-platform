import type { Video } from '@core/types';
import { VIDEOS } from '@libs/utils/mock-data';

export class SearchService {
  async search(query: string): Promise<readonly Video[]> {
    await new Promise(r => setTimeout(r, 200));
    if (!query.trim()) return VIDEOS;
    const q = query.toLowerCase();
    return VIDEOS.filter(v =>
      v.title.toLowerCase().includes(q) ||
      v.channelName.toLowerCase().includes(q) ||
      v.description.toLowerCase().includes(q) ||
      v.tags.some(t => t.toLowerCase().includes(q)),
    ).sort((a, b) => b.viewCountRaw - a.viewCountRaw);
  }
}
