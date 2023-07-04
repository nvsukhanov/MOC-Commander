import { createSelector } from '@ngrx/store';

import { CONTROLLER_SELECTORS, CONTROL_SCHEME_SELECTORS, HUBS_SELECTORS } from '../../store';

export const CONTROL_SCHEMES_LIST_SELECTORS = {
    selectSchemesList: createSelector(
        CONTROL_SCHEME_SELECTORS.selectAll,
        CONTROL_SCHEME_SELECTORS.selectRunningSchemeId,
        (schemes, runningSchemeId) => {
            return schemes.map((scheme) => ({
                ...scheme,
                isRunning: scheme.id === runningSchemeId
            }));
        }
    ),
    canCreateScheme: createSelector(
        HUBS_SELECTORS.selectAll,
        CONTROLLER_SELECTORS.selectAll,
        (hubs, controllers) => hubs.length > 0 && controllers.length > 0
    ),
} as const;
