import { getRouterSelectors } from '@ngrx/router-store';
import { createSelector } from '@ngrx/store';
import { ActivatedRouteSnapshot } from '@angular/router';
import { ROUTE_PATHS } from '../../routes';

const BASE_ROUTER_SELECTORS = { ...getRouterSelectors() } as const;

export const ROUTER_SELECTORS = {
    ...BASE_ROUTER_SELECTORS,
    selectCurrentlyViewedSchemeId: createSelector(
        BASE_ROUTER_SELECTORS.selectCurrentRoute,
        (route: ActivatedRouteSnapshot | undefined) => { // TODO: looks fragile, must be a better way to do this
            if (route
                && route.url.length === 2
                && route.url[0].path === ROUTE_PATHS.controlScheme
                && route.url[1].path !== ROUTE_PATHS.controlSchemeEditSubroute
                && route.url[1].path !== ROUTE_PATHS.controlSchemeCreateSubroute
            ) {
                return route.url[1].path;
            }
            return null;
        }
    ),
    selectCurrentlyEditedHubId: createSelector(
        BASE_ROUTER_SELECTORS.selectCurrentRoute,
        (route: ActivatedRouteSnapshot | undefined) => { // TODO: looks fragile, must be a better way to do this
            if (route
                && route.url.length === 3
                && route.url[0].path === ROUTE_PATHS.hub
                && route.url[2].path === ROUTE_PATHS.hubEditSubroute
            ) {
                return route.url[1].path;
            }
            return null;
        }
    ),
    selectCurrentlyEditedSchemeId: createSelector(
        BASE_ROUTER_SELECTORS.selectCurrentRoute,
        (route: ActivatedRouteSnapshot | undefined) => { // TODO: looks fragile, must be a better way to do this
            if (route
                && route.url.length === 3
                && route.url[0].path === ROUTE_PATHS.controlScheme
                && route.url[2].path === ROUTE_PATHS.controlSchemeEditSubroute
            ) {
                return route.url[1].path;
            }
            return null;
        }
    ),
} as const;
