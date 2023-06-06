import { createReducer, on } from '@ngrx/store';

import { INITIAL_STATE } from '../initial-state';
import { HUBS_ACTIONS } from '../actions';
import { IState } from '../i-state';

export const HUB_EDIT_FORM_ACTIVE_SAVES_REDUCER = createReducer(
    INITIAL_STATE.hubEditFormActiveSaves,
    on(HUBS_ACTIONS.requestSetHubName, (state, data): IState['hubEditFormActiveSaves'] => {
        if (state.hubIds.includes(data.hubId)) {
            return state;
        }
        return {
            hubIds: [ ...state.hubIds, data.hubId ]
        };
    }),
    on(HUBS_ACTIONS.hubNameSet, (state, data): IState['hubEditFormActiveSaves'] => {
        return {
            hubIds: state.hubIds.filter(id => id !== data.hubId)
        };
    })
);
