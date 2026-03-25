import { FeatureStore } from '@core/runtime-api/feature-store';
import type { Video, Action } from '@core/types';
import type { HomeService } from '../services/home-service';

export type SortOrder = 'relevance' | 'recent' | 'views';

export interface HomeState {
  allVideos:    readonly Video[];
  videos:       readonly Video[];
  activeFilter: string;
  sortOrder:    SortOrder;
  filters:      readonly string[];
  loading:      boolean;
  error:        string | null;
}

const INITIAL: HomeState = {
  allVideos: [], videos: [], activeFilter: 'All', sortOrder: 'relevance',
  filters: ['All','Tech','AI','Science','Space','Reviews','Dev','Gaming','Music'],
  loading: true, error: null,
};

type HA =
  | Action<{ videos: readonly Video[] }> & { type: 'LOADED'  }
  | Action<{ error: string }>            & { type: 'ERROR'   }
  | Action<null>                         & { type: 'LOADING' }
  | Action<{ filter: string }>           & { type: 'FILTER'  }
  | Action<{ sort: SortOrder }>          & { type: 'SORT'    };

function applyFilter(videos: readonly Video[], filter: string, sort: SortOrder): readonly Video[] {
  let result = filter === 'All' ? [...videos] : videos.filter(v => v.tags.includes(filter));
  if (sort === 'recent') result = [...result].sort((a, b) => b.publishedAt - a.publishedAt);
  if (sort === 'views')  result = [...result].sort((a, b) => b.viewCountRaw  - a.viewCountRaw);
  return result;
}

function reducer(s: HomeState, a: HA): HomeState {
  switch (a.type) {
    case 'LOADING': return { ...s, loading: true, error: null };
    case 'LOADED':  return { ...s, loading: false, allVideos: a.payload.videos, videos: applyFilter(a.payload.videos, s.activeFilter, s.sortOrder) };
    case 'ERROR':   return { ...s, loading: false, error: a.payload.error };
    case 'FILTER':  return { ...s, activeFilter: a.payload.filter, videos: applyFilter(s.allVideos, a.payload.filter, s.sortOrder) };
    case 'SORT':    return { ...s, sortOrder: a.payload.sort, videos: applyFilter(s.allVideos, s.activeFilter, a.payload.sort) };
    default:        return s;
  }
}

export class HomeStore {
  private readonly _store: FeatureStore<HomeState, HA>;
  private readonly _svc:   HomeService;

  constructor(svc: HomeService) { this._svc = svc; this._store = new FeatureStore('home', INITIAL, reducer); }

  getState()                              { return this._store.getState(); }
  subscribe(fn: (s: HomeState) => void)   { return this._store.subscribe(s => fn(s)); }

  async loadFeed(): Promise<void> {
    this._store.dispatch({ type: 'LOADING', payload: null });
    try {
      const videos = await this._svc.fetchFeed();
      this._store.dispatch({ type: 'LOADED', payload: { videos } });
    } catch (err) { this._store.dispatch({ type: 'ERROR', payload: { error: String(err) } }); }
  }

  setFilter(filter: string): void { this._store.dispatch({ type: 'FILTER', payload: { filter } }); }
  setSort(sort: SortOrder):  void { this._store.dispatch({ type: 'SORT',   payload: { sort }   }); }
}
