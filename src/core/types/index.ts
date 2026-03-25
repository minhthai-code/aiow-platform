// ── Routing ──────────────────────────────────────────────
export interface RouteParams { readonly [key: string]: string | undefined; }

export interface RouteDefinition {
  path:           string;
  chunkId:        string;
  load:           () => Promise<FeatureModule>;
  prefetchHints?: string[];
  priority?:      'critical' | 'normal' | 'lazy';
}

export interface NavigationContext {
  from:      string;
  to:        string;
  params:    RouteParams;
  timestamp: number;
  traceId:   string;
}

// ── Feature Modules ───────────────────────────────────────
export interface FeatureModule {
  readonly displayName: string;
  mount(container: HTMLElement, params: RouteParams): Unmount;
  prefetch?(params: RouteParams): void;
}
export type Unmount = () => void;

// ── Platform State ────────────────────────────────────────
export interface AuthState {
  readonly userId:          string | null;
  readonly displayName:     string | null;
  readonly avatarUrl:       string | null;
  readonly isAuthenticated: boolean;
}

// ── Data Models ───────────────────────────────────────────
export interface Video {
  readonly id:                    string;
  readonly title:                 string;
  readonly channelId:             string;
  readonly channelName:           string;
  readonly channelHandle:         string;
  readonly channelVerified:       boolean;
  readonly channelAvatarInitials: string;
  readonly thumbnailUrl:          string;
  readonly duration:              string;
  readonly viewCount:             string;
  readonly viewCountRaw:          number;
  readonly publishedAgo:          string;
  readonly publishedAt:           number;
  readonly description:           string;
  readonly tags:                  readonly string[];
  readonly likeCount:             string;
  readonly category:              string;
}

export interface Channel {
  readonly id:              string;
  readonly name:            string;
  readonly handle:          string;
  readonly avatarInitials:  string;
  readonly subscriberCount: string;
  readonly subscriberRaw:   number;
  readonly videoCount:      number;
  readonly verified:        boolean;
  readonly bannerGradient:  string;
  readonly description:     string;
  readonly joinedDate:      string;
  readonly totalViews:      string;
}

export interface Comment {
  readonly id:                   string;
  readonly authorName:           string;
  readonly authorAvatarInitials: string;
  readonly authorColor:          string;
  readonly text:                 string;
  readonly likeCount:            string;
  readonly publishedAgo:         string;
  readonly replyCount:           number;
  readonly isPinned:             boolean;
}

// ── API ───────────────────────────────────────────────────
export interface ApiResponse<T> {
  readonly data:      T;
  readonly status:    number;
  readonly traceId:   string;
  readonly fromCache: boolean;
  readonly latencyMs: number;
}

export interface RequestOptions {
  readonly signal?:   AbortSignal;
  readonly priority?: 'high' | 'normal' | 'low';
  readonly ttlMs?:    number;
  readonly retries?:  number;
}

// ── Platform Events ───────────────────────────────────────
export interface PlatformEventMap {
  'auth:changed':        AuthState;
  'route:will-change':   NavigationContext;
  'route:changed':       NavigationContext;
  'sidebar:toggled':     { collapsed: boolean };
  'theme:changed':       { theme: 'dark' | 'light' };
  'network:offline':     Record<string, never>;
  'network:online':      Record<string, never>;
}

export type PlatformEventType = keyof PlatformEventMap;
export type PlatformEventPayload<T extends PlatformEventType> = PlatformEventMap[T];
export type EventListener<T extends PlatformEventType> = (payload: PlatformEventPayload<T>) => void;

// ── Scheduler ─────────────────────────────────────────────
export type TaskPriority = 'immediate' | 'user-blocking' | 'user-visible' | 'normal' | 'background';

// ── Store ─────────────────────────────────────────────────
export interface Action<T = unknown> {
  readonly type:      string;
  readonly payload:   T;
  readonly traceId:   string;
  readonly timestamp: number;
  readonly featureId: string;
}

export type Reducer<S, A extends Action = Action> = (state: S, action: A) => S;
export type StoreListener<S> = (state: S, prev: S) => void;

// ── Navigation Cache (System D) ───────────────────────────
export interface NavCacheEntryRef {
  routeKey: string;
  scrollY:  number;
  savedAt:  number;
}

// ── Navigation Predictor (System B) ──────────────────────
export interface NavPrediction {
  path:       string;
  confidence: number;
}

// ── Canary (System G) ─────────────────────────────────────
export interface CanaryFlag {
  key:            string;
  rolloutPercent: number;
}

// ── Hydration (System A) ──────────────────────────────────
export type HydrationPhase = 'critical' | 'high' | 'low';

// ── Performance Budget (System H) ────────────────────────
export interface PerfViolationRef {
  component: string;
  type:      string;
  actualMs:  number;
  budgetMs:  number;
}

// ── Tracing (System F) ────────────────────────────────────
export interface TraceContext {
  traceId:     string;
  spanId:      string;
  parentSpanId?: string;
}
