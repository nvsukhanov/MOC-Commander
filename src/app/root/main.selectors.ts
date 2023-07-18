import { createSelector } from '@ngrx/store';
import { CONTROLLER_SELECTORS, CONTROL_SCHEME_SELECTORS, HUBS_SELECTORS, HUB_STATS_SELECTORS } from '@app/store';

export const MAIN_SELECTORS = {
    selectConnectedControllersCount: createSelector(
        CONTROLLER_SELECTORS.selectIds,
        (controllers) => controllers.length
    ),
    selectConnectedHubsCount: createSelector(
        HUB_STATS_SELECTORS.selectIds,
        (statIds) => statIds.length
    ),
    selectControlSchemesCount: createSelector(
        CONTROL_SCHEME_SELECTORS.selectIds,
        (schemeIds) => schemeIds.length
    ),
    shouldShowProgressBar: createSelector(
        HUBS_SELECTORS.selectIsDiscovering,
        (isDiscovering) => isDiscovering
    ),
};
