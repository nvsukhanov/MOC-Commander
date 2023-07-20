import { createSelector } from '@ngrx/store';
import { CONTROLLER_SELECTORS, CONTROL_SCHEME_V2_SELECTORS, HUBS_SELECTORS } from '@app/store';

import { CONTROL_SCHEMES_FEATURE_SELECTORS } from '../control-schemes-feature.selectors';

export const CONTROL_SCHEMES_LIST_SELECTORS = {
    selectSchemesList: createSelector(
        CONTROL_SCHEME_V2_SELECTORS.selectAll,
        CONTROL_SCHEME_V2_SELECTORS.selectRunningSchemeId,
        (schemes, runningSchemeId) => {
            return schemes.map((scheme) => ({
                ...scheme,
                isRunning: scheme.id === runningSchemeId
            }));
        }
    ),
    canCreateScheme: createSelector(
        HUBS_SELECTORS.selectTotal,
        CONTROLLER_SELECTORS.selectTotal,
        CONTROL_SCHEMES_FEATURE_SELECTORS.hasControllableIos(),
        (hubsTotal, controllersTotal, hasControllableIos) => hubsTotal > 0 && controllersTotal > 0 && hasControllableIos
    ),
} as const;
