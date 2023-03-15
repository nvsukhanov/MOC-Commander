import { createReducer, on } from '@ngrx/store';
import { ControllerConnectionState, IState } from './i-state';
import { ACTION_CONTROLLER_READ, ACTIONS_CONFIGURE_CONTROLLER } from './actions';
import { ControllerType } from '../types';

export const INITIAL_STATE: IState = {
    controller: {
        controllerType: ControllerType.Unassigned,
        connectionState: ControllerConnectionState.NotConnected,
        gamepadController: {
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
        gamepadController: props.gamepad,
        connectionState: ControllerConnectionState.Connected
    })),
    on(ACTIONS_CONFIGURE_CONTROLLER.disconnectGamepad, (state, props) => {
        if (state.gamepadController?.index === props.index) {
            return {
                ...state,
                controllerType: ControllerType.Unassigned,
                gamepadController: { ...INITIAL_STATE.controller.gamepadController },
                connectionState: ControllerConnectionState.NotConnected,
                controllerState: []
            };
        } else {
            return state;
        }
    }),
    on(ACTIONS_CONFIGURE_CONTROLLER.listenForGamepad, (state) => ({ ...state, connectionState: ControllerConnectionState.WaitingForConnect })),
    on(ACTION_CONTROLLER_READ, (state, props) => ({ ...state, controllerState: props.state })),
    on(ACTIONS_CONFIGURE_CONTROLLER.cancelListeningForGamepad, (state) => ({ ...state, connectionState: ControllerConnectionState.NotConnected }))
);
