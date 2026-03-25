import { FeatureStore } from '@core/runtime-api/feature-store';
import type { Channel, Video, Action } from '@core/types';
import type { ChannelService } from '../services/channel-service';

export interface ChannelState {
  channel:    Channel | null;
  videos:     readonly Video[];
  activeTab:  string;
  subscribed: boolean;
  loading:    boolean;
  error:      string | null;
}

const INITIAL: ChannelState = { channel:null, videos:[], activeTab:'Home', subscribed:false, loading:true, error:null };

type ChannelAction =
  | Action<{ channel: Channel; videos: readonly Video[] }> & { type: 'LOADED'    }
  | Action<null>    & { type: 'LOADING'    }
  | Action<string>  & { type: 'ERROR'      }
  | Action<string>  & { type: 'TAB'        }
  | Action<boolean> & { type: 'SUBSCRIBED' };

function reducer(s: ChannelState, a: ChannelAction): ChannelState {
  switch (a.type) {
    case 'LOADING':    return { ...s, loading:true,  error:null };
    case 'LOADED':     return { ...s, loading:false, ...a.payload };
    case 'ERROR':      return { ...s, loading:false, error:a.payload };
    case 'TAB':        return { ...s, activeTab:a.payload };
    case 'SUBSCRIBED': return { ...s, subscribed:a.payload };
    default:           return s;
  }
}

export class ChannelStore {
  private readonly _store: FeatureStore<ChannelState, ChannelAction>;
  private readonly _svc:   ChannelService;

  constructor(svc: ChannelService) {
    this._svc   = svc;
    this._store = new FeatureStore('channel', INITIAL, reducer);
  }

  getState()                                { return this._store.getState(); }
  subscribe(fn: (s: ChannelState) => void)  { return this._store.subscribe(s => fn(s)); }

  async load(channelId: string): Promise<void> {
    this._store.dispatch({ type:'LOADING', payload:null });
    try {
      const data = await this._svc.fetch(channelId);
      this._store.dispatch({ type:'LOADED', payload:data });
    } catch (err) {
      this._store.dispatch({ type:'ERROR', payload:String(err) });
    }
  }

  setTab(t: string):     void { this._store.dispatch({ type:'TAB',        payload:t }); }
  toggleSub():           void { this._store.dispatch({ type:'SUBSCRIBED', payload:!this._store.getState().subscribed }); }
}
