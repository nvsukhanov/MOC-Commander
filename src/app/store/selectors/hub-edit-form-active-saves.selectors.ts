/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IState } from '../i-state';

const HUB_EDIT_FORM_ACTIVE_SAVES_FEATURE_SELECTOR = createFeatureSelector<IState['hubEditFormActiveSaves']>('hubEditFormActiveSaves');

export const HUB_EDIT_FORM_ACTIVE_SAVES_SELECTORS = {
    isSaveInProgress: (hubId: string) => createSelector(
        HUB_EDIT_FORM_ACTIVE_SAVES_FEATURE_SELECTOR,
        (state) => state.hubIds.includes(hubId)
    )
};
