import { createSelector } from '@ngrx/store';
import { HUBS_SELECTORS } from '@app/store';

export const MAIN_SELECTORS = {
    shouldShowProgressBar: createSelector(
        HUBS_SELECTORS.selectIsDiscovering,
        (isDiscovering) => isDiscovering
    ),
};
