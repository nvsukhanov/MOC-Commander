import { createReducer, on } from '@ngrx/store';
import { INITIAL_STATE } from './i-state';
import { ACTIONS_CONFIGURE_CONTROLLER } from './actions';

export const CONTROLLER_CONFIG_REDUCERS = createReducer(
    INITIAL_STATE['controllerConfig'],
    on(ACTIONS_CONFIGURE_CONTROLLER.setControllerType, (state, props) => ({ ...state, controllerType: props.controllerType }))
);

export const CONTROLLER_ACTIONS_REDUCER = createReducer(
    INITIAL_STATE['controllerState']
);
