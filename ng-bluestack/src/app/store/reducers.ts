import { createReducer, on } from '@ngrx/store';
import { IState } from './i-state';
import { ACTIONS_CONFIGURE_CONTROLLER } from './actions';

export const INITIAL_STATE: IState = {
    controller: {
        controllerType: null,
        gamepadController: {
            isConnected: false,
            id: null,
            axes: [],
            buttons: {}
        },
        controllerState: [],
    }
}

export const CONTROLLER_CONFIG_REDUCERS = createReducer(
    INITIAL_STATE['controller'],
    on(ACTIONS_CONFIGURE_CONTROLLER.setControllerType, (state, props) => ({ ...state, controllerType: props.controllerType }))
);
