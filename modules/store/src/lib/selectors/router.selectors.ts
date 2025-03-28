import { getRouterSelectors } from '@ngrx/router-store';
import { createSelector } from '@ngrx/store';
import { ActivatedRouteSnapshot } from '@angular/router';

const BASE_ROUTER_SELECTORS = { ...getRouterSelectors() } as const;

export const ROUTER_SELECTORS = {
  ...BASE_ROUTER_SELECTORS,
  selectCurrentlyViewedSchemeName: createSelector(BASE_ROUTER_SELECTORS.selectCurrentRoute, (route: ActivatedRouteSnapshot | undefined): string | null => {
    const schemeName = route?.params?.['schemeName'] ?? null;
    if (schemeName === null) {
      return null;
    }
    return decodeURI(schemeName);
  }),
  selectCurrentlyRenamedSchemeName: createSelector(BASE_ROUTER_SELECTORS.selectCurrentRoute, (route: ActivatedRouteSnapshot | undefined): string | null => {
    const schemeName = route?.params?.['schemeName'] ?? null;
    if (schemeName === null) {
      return null;
    }
    return decodeURI(schemeName);
  }),
  selectCurrentlyEditedHubId: createSelector(BASE_ROUTER_SELECTORS.selectCurrentRoute, (route: ActivatedRouteSnapshot | undefined): string | null => {
    return route?.params?.['id'] ?? null;
  }),
  selectCurrentlyEditedSchemeName: createSelector(BASE_ROUTER_SELECTORS.selectCurrentRoute, (route: ActivatedRouteSnapshot | undefined): string | null => {
    const schemeName = route?.params?.['schemeName'] ?? null;
    if (schemeName === null) {
      return null;
    }
    return decodeURI(schemeName);
  }),
  selectCurrentlyEditedBindingId: createSelector(BASE_ROUTER_SELECTORS.selectCurrentRoute, (route: ActivatedRouteSnapshot | undefined): number | null => {
    return Number.parseInt(route?.params?.['bindingId'] ?? '0');
  }),
  selectCurrentlyViewedHubId: createSelector(BASE_ROUTER_SELECTORS.selectCurrentRoute, (route: ActivatedRouteSnapshot | undefined): string | null => {
    return route?.params?.['id'] ?? null;
  }),
} as const;
