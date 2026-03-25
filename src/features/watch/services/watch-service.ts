import type { Video, Comment } from '@core/types';
import { VIDEOS, COMMENTS } from '@libs/utils/mock-data';

export interface WatchPayload { video: Video; recommendations: readonly Video[]; comments: readonly Comment[]; }

export class WatchService {
  async fetch(videoId: string): Promise<WatchPayload> {
    await new Promise(r => setTimeout(r, 200));
    const video = VIDEOS.find(v => v.id === videoId) ?? VIDEOS[0]!;
    // Smart recommendations: same category first, then by views
    const recs  = VIDEOS.filter(v => v.id !== video.id)
      .sort((a, b) => {
        if (a.category === video.category && b.category !== video.category) return -1;
        if (b.category === video.category && a.category !== video.category) return  1;
        return b.viewCountRaw - a.viewCountRaw;
      });
    return { video, recommendations: recs, comments: COMMENTS };
  }
}
