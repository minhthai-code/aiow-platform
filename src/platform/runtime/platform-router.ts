import { NavigationController } from '@core/router/router';
import { createV8RouterHooks } from '@platform/router-adapters/v8-router-hooks';

export type PlatformRouter = NavigationController;

export const router = new NavigationController(createV8RouterHooks());

