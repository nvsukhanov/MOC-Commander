import { createFeature, createReducer, on } from '@ngrx/store';

import { HUBS_ACTIONS } from '../actions';

export type HubEditFormActiveSavesState = {
    hubIds: string[];
};

export const HUB_EDIT_FORM_ACTIVE_SAVES_INITIAL_STATE = {
    hubIds: [] as string[]
};

export const HUB_EDIT_FORM_ACTIVE_SAVES_FEATURE = createFeature({
    name: 'hubEditFormActiveSaves',
    reducer: createReducer(
        HUB_EDIT_FORM_ACTIVE_SAVES_INITIAL_STATE,
        on(HUBS_ACTIONS.requestSetHubName, (state, data): HubEditFormActiveSavesState => {
            if (state.hubIds.includes(data.hubId)) {
                return state;
            }
            return {
                hubIds: [ ...state.hubIds, data.hubId ]
            };
        }),
        on(HUBS_ACTIONS.hubNameSet, HUBS_ACTIONS.hubNameSetError, (state, data): HubEditFormActiveSavesState => {
            return {
                hubIds: state.hubIds.filter((id) => id !== data.hubId)
            };
        })
    )
});
