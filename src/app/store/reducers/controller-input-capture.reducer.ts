import { createReducer, on } from '@ngrx/store';

import { CONTROLLER_INPUT_ACTIONS, CONTROL_SCHEME_CONFIGURATION_ACTIONS } from '../actions';
import { INITIAL_STATE } from '../initial-state';
import { IState } from '../i-state';

export const CONTROLLER_INPUT_CAPTURE_REDUCER = createReducer(
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
            const nextListenersCount = state.listenersCount - 1;
            if (nextListenersCount < 0) {
                throw new Error('Cannot release input capture when no listeners are registered');
            }
            return {
                ...state,
                listenersCount: nextListenersCount < 0 ? 0 : nextListenersCount
            };
        })
);
