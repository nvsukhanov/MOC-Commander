import { createReducer, on } from '@ngrx/store';

import { INITIAL_STATE } from '../initial-state';
import { CONTROLLER_SETTINGS_ACTIONS } from '../actions';
import { CONTROLLER_SETTINGS_ENTITY_ADAPTER } from '../entity-adapters';
import { IState } from '../i-state';

export const CONTROLLER_SETTINGS_REDUCER = createReducer(
    INITIAL_STATE.controllerSettings,
    on(CONTROLLER_SETTINGS_ACTIONS.updateSettings, (state, action): IState['controllerSettings'] => {
        return CONTROLLER_SETTINGS_ENTITY_ADAPTER.upsertOne(action.settings, state);
    })
);
