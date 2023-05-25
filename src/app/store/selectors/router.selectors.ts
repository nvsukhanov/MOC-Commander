import { getRouterSelectors } from '@ngrx/router-store';
import { createSelector } from '@ngrx/store';
import { ActivatedRouteSnapshot } from '@angular/router';

const BASE_ROUTER_SELECTORS = { ...getRouterSelectors() } as const;

export const ROUTER_SELECTORS = {
    ...BASE_ROUTER_SELECTORS,
    selectCurrentlyViewedSchemeId: createSelector(
        BASE_ROUTER_SELECTORS.selectCurrentRoute,
        (route: ActivatedRouteSnapshot | undefined): string | null => {
            return route?.params?.['id'] ?? null;
        }
    ),
    selectCurrentlyEditedHubId: createSelector(
        BASE_ROUTER_SELECTORS.selectCurrentRoute,
        (route: ActivatedRouteSnapshot | undefined): string | null => {
            return route?.params?.['id'] ?? null;
        }
    ),
    selectCurrentlyEditedSchemeId: createSelector(
        BASE_ROUTER_SELECTORS.selectCurrentRoute,
        (route: ActivatedRouteSnapshot | undefined): string | null => {
            return route?.params?.['id'] ?? null;
        }
    ),
} as const;
