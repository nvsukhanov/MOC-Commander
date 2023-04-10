import { createReducer, on } from '@ngrx/store';
import { ControllerConnectionState, ControllerType, IState } from '../i-state';
import { ACTION_CONTROLLER_READ, ACTION_KEYBOARD_EVENTS, ACTIONS_CONFIGURE_CONTROLLER } from '../actions';
import { INITIAL_STATE } from '../initial-state';
import { BUTTON_PRESSED, BUTTON_RELEASED } from '../../types';

export const CONFIGURE_CONTROLLER_REDUCER = createReducer(
    INITIAL_STATE['controller'],
    on(ACTIONS_CONFIGURE_CONTROLLER.gamepadConnected, (state, props): IState['controller'] => ({
        ...state,
        controllerType: ControllerType.GamePad,
        gamepadConfig: props.gamepad,
        connectionState: ControllerConnectionState.Connected
    })),
    on(ACTIONS_CONFIGURE_CONTROLLER.listenForGamepad, (state): IState['controller'] =>
        ({ ...state, connectionState: ControllerConnectionState.Listening })
    ),
    on(ACTION_CONTROLLER_READ, (state, props): IState['controller'] => ({ ...state, controllerState: { axes: props.axes, buttons: props.buttons } })),
    on(ACTIONS_CONFIGURE_CONTROLLER.cancelListeningForGamepad, (state): IState['controller'] => {
            if (state.connectionState === ControllerConnectionState.Listening) {
                return { ...state, connectionState: ControllerConnectionState.NotConnected };
            } else {
                return state;
            }
        }
    ),
    on(ACTION_KEYBOARD_EVENTS.keyDown, (state, data) => ({
        ...state,
        controllerState: {
            ...state.controllerState,
            buttons: {
                ...state.controllerState.buttons,
                [data.code]: { index: data.code, value: BUTTON_PRESSED }
            }
        }
    })),
    on(ACTION_KEYBOARD_EVENTS.keyUp, (state, data) => ({
        ...state,
        controllerState: {
            ...state.controllerState,
            buttons: {
                ...state.controllerState.buttons,
                [data.code]: { index: data.code, value: BUTTON_RELEASED }
            }
        }
    })),
    on(ACTIONS_CONFIGURE_CONTROLLER.keyboardConnected, (state) => ({
        ...state,
        connectionState: ControllerConnectionState.Connected,
        controllerType: ControllerType.Keyboard
    })),
    on(ACTIONS_CONFIGURE_CONTROLLER.disconnectController, (state) => ({
        ...state,
        connectionState: ControllerConnectionState.NotConnected,
        controllerType: ControllerType.Unassigned,
        controllerState: {
            axes: [],
            buttons: {}
        }
    }))
);
