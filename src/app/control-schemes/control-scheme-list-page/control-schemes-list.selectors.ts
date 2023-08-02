import { createSelector } from '@ngrx/store';
import { CONTROL_SCHEME_SELECTORS } from '@app/store';

export const CONTROL_SCHEMES_LIST_PAGE_SELECTORS = {
    selectSchemesList: createSelector(
        CONTROL_SCHEME_SELECTORS.selectAll,
        CONTROL_SCHEME_SELECTORS.selectRunningSchemeId,
        (schemes, runningSchemeId) => {
            return schemes.map((scheme) => ({
                ...scheme,
                isRunning: scheme.id === runningSchemeId
            }));
        }
    )
} as const;
