import { createSelector } from '@ngrx/store';

import { HUB_DISCOVERY_STATE_SELECTORS } from './hub-discovery-state.selectors';

export const GLOBAL_PROGRESS_BAR_SELECTORS = {
    shouldShowProgressBar: createSelector(
        HUB_DISCOVERY_STATE_SELECTORS.isDiscoveryBusy,
        (isDiscoveryBusy) => isDiscoveryBusy
    ),
} as const;
