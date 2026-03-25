import type { Video } from '@core/types';
import { VIDEOS } from '@libs/utils/mock-data';

export class HomeService {
  async fetchFeed(): Promise<readonly Video[]> {
    await new Promise(r => setTimeout(r, 200));
    return VIDEOS;
  }
}
