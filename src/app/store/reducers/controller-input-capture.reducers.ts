import { createReducer, on } from '@ngrx/store';
import { CONTROL_SCHEME_CONFIGURATION_ACTIONS, CONTROLLER_INPUT_ACTIONS } from '../actions';
import { INITIAL_STATE } from '../initial-state';
import { IState } from '../i-state';

export const CONTROLLER_INPUT_CAPTURE_REDUCERS = createReducer(
    INITIAL_STATE.controllerInputCapture,
    on(CONTROLLER_INPUT_ACTIONS.requestInputCapture,
        CONTROL_SCHEME_CONFIGURATION_ACTIONS.startListening,
        (state): IState['controllerInputCapture'] => {
            return {
                ...state,
                listenersCount: state.listenersCount + 1
            };
        }),
    on(CONTROLLER_INPUT_ACTIONS.releaseInputCapture,
        CONTROL_SCHEME_CONFIGURATION_ACTIONS.stopListening,
        (state): IState['controllerInputCapture'] => {
            return {
                ...state,
                listenersCount: state.listenersCount - 1 || 0
            };
        })
);
