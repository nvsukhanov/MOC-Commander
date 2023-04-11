import { GAMEPAD_AXES_STATES_ENTITY_ADAPTER } from '../entity-adapters';
import { createReducer, on } from '@ngrx/store';
import { GAMEPAD_ACTIONS } from '../actions';

export const GAMEPAD_AXES_STATE_REDUCERS = createReducer(
    GAMEPAD_AXES_STATES_ENTITY_ADAPTER.getInitialState(),
    on(GAMEPAD_ACTIONS.updateGamepadsValues, (state, props) => {
        return GAMEPAD_AXES_STATES_ENTITY_ADAPTER.upsertMany(props.axesState, state);
    }),
    on(GAMEPAD_ACTIONS.gamepadDisconnected, (state, props) => {
        return GAMEPAD_AXES_STATES_ENTITY_ADAPTER.removeMany((axis) => axis.gamepadIndex === props.gamepadIndex, state);
    })
);
