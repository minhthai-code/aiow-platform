import type { RouterHooks } from '@core/router/router-hooks';
import { PlatformEngine } from '@platform/engine/platform-engine';
import { createV6RouterHooks } from './v6-router-hooks';

const engine = new PlatformEngine();

export function createV8RouterHooks(): RouterHooks {
  const v6 = createV6RouterHooks();

  return {
    ...v6,
    onNavigate: async (intent) => {
      await engine.navigate(intent);
    },
  };
}

