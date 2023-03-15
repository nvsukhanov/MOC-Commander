import { createReducer, on } from '@ngrx/store';
import { IState } from './i-state';
import { ACTIONS_CONFIGURE_CONTROLLER } from './actions';
import { ControllerType } from '../types';

export const INITIAL_STATE: IState = {
    controller: {
        controllerType: ControllerType.Unassigned,
        gamepadController: {
            isConnected: false,
            index: null,
            nameL10nKey: null,
            axisGroups: [],
            buttons: []
        },
        controllerState: [],
    }
}

export const CONTROLLER_CONFIG_REDUCERS = createReducer(
    INITIAL_STATE['controller'],
    on(ACTIONS_CONFIGURE_CONTROLLER.gamepadConnected, (state, props) => ({
        ...state,
        controllerType: ControllerType.GamePad,
        gamepadController: props.gamepad
    })),
    on(ACTIONS_CONFIGURE_CONTROLLER.disconnectGamepad, (state, props) => {
        if (state.gamepadController?.index === props.index) {
            return { ...state, controllerType: ControllerType.Unassigned, gamepadController: { ...INITIAL_STATE.controller.gamepadController } };
        } else {
            return state;
        }
    })
);
