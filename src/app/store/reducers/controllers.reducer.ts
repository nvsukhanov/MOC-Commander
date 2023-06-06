import { createReducer, on } from '@ngrx/store';

import { INITIAL_STATE } from '../initial-state';
import { CONTROLLERS_ACTIONS } from '../actions';
import { CONTROLLERS_ENTITY_ADAPTER } from '../entity-adapters';
import { IState } from '../i-state';

export const CONTROLLERS_REDUCER = createReducer(
    INITIAL_STATE.controllers,
    on(CONTROLLERS_ACTIONS.connected, (state, action): IState['controllers'] => {
        return CONTROLLERS_ENTITY_ADAPTER.addOne(action, state);
    }),
    on(CONTROLLERS_ACTIONS.disconnected, (state, action): IState['controllers'] => {
        return CONTROLLERS_ENTITY_ADAPTER.removeOne(action.id, state);
    }),
);
