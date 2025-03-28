import { createSelector } from '@ngrx/store';

import { HUB_EDIT_FORM_ACTIVE_SAVES_FEATURE } from '../reducers';

export const HUB_EDIT_FORM_ACTIVE_SAVES_SELECTORS = {
  currentlySavingHubIds: createSelector(HUB_EDIT_FORM_ACTIVE_SAVES_FEATURE.selectHubEditFormActiveSavesState, (state) => state.hubIds),
  isAnyHubSaveInProgress: createSelector(HUB_EDIT_FORM_ACTIVE_SAVES_FEATURE.selectHubEditFormActiveSavesState, (state) => state.hubIds.length > 0),
};
