import { getRouterSelectors } from '@ngrx/router-store';
import { createSelector } from '@ngrx/store';
import { ActivatedRouteSnapshot } from '@angular/router';
import { CONTROL_SCHEME_CREATE_SUBROUTE, CONTROL_SCHEME_EDIT_SUBROUTE, CONTROL_SCHEME_ROUTE } from '../../routes';

const BASE_ROUTER_SELECTORS = { ...getRouterSelectors() } as const;

export const ROUTER_SELECTORS = {
    ...BASE_ROUTER_SELECTORS,
    selectCurrentlyViewedSchemeId: createSelector(
        BASE_ROUTER_SELECTORS.selectCurrentRoute,
        (route: ActivatedRouteSnapshot | undefined) => { // TODO: looks fragile, must be a better way to do this
            if (route
                && route.url.length === 2
                && route.url[0].path === CONTROL_SCHEME_ROUTE
                && ![ CONTROL_SCHEME_EDIT_SUBROUTE, CONTROL_SCHEME_CREATE_SUBROUTE ].includes(route.url[1].path)
            ) {
                return route.url[1].path;
            }
            return null;
        }
    )
} as const;
