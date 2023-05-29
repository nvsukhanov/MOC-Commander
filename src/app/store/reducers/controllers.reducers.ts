import { createReducer, on } from '@ngrx/store';
import { INITIAL_STATE } from '../initial-state';
import { CONTROLLERS_ACTIONS } from '../actions';
import { CONTROLLERS_ENTITY_ADAPTER } from '../entity-adapters';

export const CONTROLLERS_REDUCERS = createReducer(
    INITIAL_STATE.controllers,
    on(CONTROLLERS_ACTIONS.connected, (state, action) => {
        return CONTROLLERS_ENTITY_ADAPTER.addOne(action, state);
    }),
    on(CONTROLLERS_ACTIONS.disconnected, (state, action) => {
        return CONTROLLERS_ENTITY_ADAPTER.removeOne(action.id, state);
    }),
);
