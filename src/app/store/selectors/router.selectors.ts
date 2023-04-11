import { getRouterSelectors } from '@ngrx/router-store';

export const ROUTER_SELECTORS = { ...getRouterSelectors() } as const;
