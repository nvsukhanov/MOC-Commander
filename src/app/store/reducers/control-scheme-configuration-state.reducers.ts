/* eslint-disable @ngrx/on-function-explicit-return-type */
import { createReducer, on } from '@ngrx/store';
import { INITIAL_STATE } from '../initial-state';
import { GAMEPAD_ACTIONS } from '../actions';

export const CONTROL_SCHEME_CONFIGURATION_STATE_REDUCERS = createReducer(
    INITIAL_STATE['controlSchemeConfigurationState'],
    on(GAMEPAD_ACTIONS.gamepadWaitForUserInput, (state) => ({ ...state, isListening: true })),
    on(
        GAMEPAD_ACTIONS.gamepadUserInputReceived,
        GAMEPAD_ACTIONS.gamepadWaitForUserInputCancel,
        (state) => ({ ...state, isListening: false })
    )
);
