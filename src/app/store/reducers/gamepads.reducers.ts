import { createReducer, on } from '@ngrx/store';
import { GAMEPADS_ENTITY_ADAPTER } from '../entity-adapters';
import { GAMEPAD_ACTIONS } from '../actions';

export const GAMEPAD_REDUCERS = createReducer(
    GAMEPADS_ENTITY_ADAPTER.getInitialState(),
    on(GAMEPAD_ACTIONS.gamepadConnected, (state, props) => GAMEPADS_ENTITY_ADAPTER.addOne(props.gamepad, state)),
    on(GAMEPAD_ACTIONS.gamepadDisconnected, (state, props) => GAMEPADS_ENTITY_ADAPTER.removeOne(props.gamepadIndex, state)),
);
