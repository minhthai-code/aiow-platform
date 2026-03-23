import { FeatureStore } from '@core/runtime-api/feature-store';
import type { Video, Action } from '@core/types';
import type { SearchService } from '../services/search-service';

export interface SearchState {
  results:      readonly Video[];
  query:        string;
  activeFilter: string;
  loading:      boolean;
  error:        string | null;
}

const INITIAL: SearchState = { results:[], query:'', activeFilter:'All', loading:false, error:null };

type SearchAction =
  | Action<{ results: readonly Video[]; query: string }> & { type: 'DONE'    }
  | Action<string>                                        & { type: 'START'   }
  | Action<string>                                        & { type: 'ERROR'   }
  | Action<string>                                        & { type: 'FILTER'  };

function reducer(s: SearchState, a: SearchAction): SearchState {
  switch (a.type) {
    case 'START':  return { ...s, loading:true, query:a.payload, error:null };
    case 'DONE':   return { ...s, loading:false, results:a.payload.results };
    case 'ERROR':  return { ...s, loading:false, error:a.payload };
    case 'FILTER': return { ...s, activeFilter:a.payload };
    default:       return s;
  }
}

export class SearchStore {
  private readonly _store: FeatureStore<SearchState, SearchAction>;
  private readonly _svc:   SearchService;

  constructor(svc: SearchService) {
    this._svc   = svc;
    this._store = new FeatureStore('search', INITIAL, reducer);
  }

  getState()                               { return this._store.getState(); }
  subscribe(fn: (s: SearchState) => void)  { return this._store.subscribe(s => fn(s)); }

  async search(query: string): Promise<void> {
    this._store.dispatch({ type: 'START', payload: query });
    try {
      const results = await this._svc.search(query);
      this._store.dispatch({ type: 'DONE', payload: { results, query } });
    } catch (err) {
      this._store.dispatch({ type: 'ERROR', payload: String(err) });
    }
  }

  setFilter(f: string): void { this._store.dispatch({ type: 'FILTER', payload: f }); }
}
