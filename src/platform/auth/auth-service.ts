import type { AuthState } from '@core/types';
import type { ApiClient } from '@platform/api-client/client';

const ANON: AuthState = { userId: null, displayName: null, avatarUrl: null, isAuthenticated: false };

export class AuthService {
  private _state: AuthState = ANON;
  private readonly _api: ApiClient;

  constructor(api: ApiClient) { this._api = api; }

  async initialize(): Promise<AuthState> {
    // Dev: skip network entirely — return anonymous state immediately
    if (import.meta.env.DEV) {
      this._state = ANON;
      return this._state;
    }
    try {
      const { data } = await this._api.get<{ userId: string; displayName: string; avatarUrl: string }>(
        '/auth/me', { priority: 'high', ttlMs: 0 },
      );
      this._state = { userId: data.userId, displayName: data.displayName, avatarUrl: data.avatarUrl, isAuthenticated: true };
    } catch { this._state = ANON; }
    return this._state;
  }

  getState(): Readonly<AuthState> { return this._state; }
}
