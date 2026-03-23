import { FeatureStore } from '@core/runtime-api/feature-store';
import type { Video, Comment, Action } from '@core/types';
import type { WatchService } from '../services/watch-service';

export interface WatchState {
  video:           Video | null;
  recommendations: readonly Video[];
  comments:        readonly Comment[];
  loading:         boolean;
  error:           string | null;
  descExpanded:    boolean;
  subscribed:      boolean;
  liked:           boolean;
}

const INITIAL: WatchState = {
  video: null, recommendations: [], comments: [],
  loading: true, error: null,
  descExpanded: false, subscribed: false, liked: false,
};

type WatchAction =
  | Action<{ video: Video; recommendations: readonly Video[]; comments: readonly Comment[] }> & { type: 'LOADED'    }
  | Action<null>    & { type: 'LOADING'    }
  | Action<string>  & { type: 'ERROR'      }
  | Action<boolean> & { type: 'DESC'       }
  | Action<boolean> & { type: 'SUBSCRIBED' }
  | Action<boolean> & { type: 'LIKED'      };

function reducer(s: WatchState, a: WatchAction): WatchState {
  switch (a.type) {
    case 'LOADING':    return { ...s, loading: true,  error: null, video: null };
    case 'LOADED':     return { ...s, loading: false, ...a.payload };
    case 'ERROR':      return { ...s, loading: false, error: a.payload };
    case 'DESC':       return { ...s, descExpanded: a.payload };
    case 'SUBSCRIBED': return { ...s, subscribed: a.payload };
    case 'LIKED':      return { ...s, liked: a.payload };
    default:           return s;
  }
}

export class WatchStore {
  private readonly _store: FeatureStore<WatchState, WatchAction>;
  private readonly _svc:   WatchService;

  constructor(svc: WatchService) {
    this._svc   = svc;
    this._store = new FeatureStore('watch', INITIAL, reducer);
  }

  getState()                              { return this._store.getState(); }
  subscribe(fn: (s: WatchState) => void)  { return this._store.subscribe(s => fn(s)); }

  async load(videoId: string): Promise<void> {
    this._store.dispatch({ type: 'LOADING', payload: null });
    try {
      const data = await this._svc.fetch(videoId);
      this._store.dispatch({ type: 'LOADED', payload: data });
    } catch (err) {
      this._store.dispatch({ type: 'ERROR', payload: String(err) });
    }
  }

  toggleDesc():      void { this._store.dispatch({ type: 'DESC',       payload: !this._store.getState().descExpanded }); }
  toggleSubscribe(): void { this._store.dispatch({ type: 'SUBSCRIBED', payload: !this._store.getState().subscribed });   }
  toggleLike():      void { this._store.dispatch({ type: 'LIKED',      payload: !this._store.getState().liked });         }
}
