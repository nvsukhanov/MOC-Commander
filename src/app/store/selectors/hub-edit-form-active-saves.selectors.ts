/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { createSelector } from '@ngrx/store';

import { HUB_EDIT_FORM_ACTIVE_SAVES_FEATURE } from '../reducers';

export const HUB_EDIT_FORM_ACTIVE_SAVES_SELECTORS = {
    isSaveInProgress: (hubId: string) => createSelector(
        HUB_EDIT_FORM_ACTIVE_SAVES_FEATURE.selectHubEditFormActiveSavesState,
        (state) => state.hubIds.includes(hubId)
    )
};
