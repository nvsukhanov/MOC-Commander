import { GAMEPAD_BUTTONS_STATES_ENTITY_ADAPTER } from '../entity-adapters';
import { createReducer, on } from '@ngrx/store';
import { GAMEPAD_ACTIONS } from '../actions';

export const GAMEPAD_BUTTONS_STATE_REDUCERS = createReducer(
    GAMEPAD_BUTTONS_STATES_ENTITY_ADAPTER.getInitialState(),
    on(GAMEPAD_ACTIONS.updateGamepadsValues, (state, props) => {
        return GAMEPAD_BUTTONS_STATES_ENTITY_ADAPTER.upsertMany(props.buttonsState, state);
    }),
    on(GAMEPAD_ACTIONS.gamepadDisconnected, (state, props) => {
        return GAMEPAD_BUTTONS_STATES_ENTITY_ADAPTER.removeMany((button) => button.gamepadIndex === props.gamepadIndex, state);
    })
);
