import { createReducer, on } from '@ngrx/store';
import { ControllerConnectionState, IState } from './i-state';
import { ACTION_CONTROLLER_READ, ACTIONS_CONFIGURE_CONTROLLER } from './actions';
import { ControllerType } from '../types';

export const INITIAL_STATE: IState = {
    controller: {
        controllerType: ControllerType.Unassigned,
        connectionState: ControllerConnectionState.NotConnected,
        gamepadConfig: {
            index: null,
            nameL10nKey: null,
            axisGroups: [],
            buttons: []
        },
        controllerState: {
            axes: {},
            buttons: {}
        }
    }
}

export const CONTROLLER_CONFIG_REDUCERS = createReducer(
    INITIAL_STATE['controller'],
    on(ACTIONS_CONFIGURE_CONTROLLER.gamepadConnected, (state, props): IState['controller'] => ({
        ...state,
        controllerType: ControllerType.GamePad,
        gamepadConfig: props.gamepad,
        connectionState: ControllerConnectionState.Connected
    })),
    on(ACTIONS_CONFIGURE_CONTROLLER.disconnectGamepad, (state, props): IState['controller'] => {
        if (state.gamepadConfig?.index === props.index) {
            return {
                ...state,
                controllerType: ControllerType.Unassigned,
                gamepadConfig: { ...INITIAL_STATE.controller.gamepadConfig },
                connectionState: ControllerConnectionState.NotConnected,
                controllerState: {
                    axes: {},
                    buttons: {}
                }
            };
        } else {
            return state;
        }
    }),
    on(ACTIONS_CONFIGURE_CONTROLLER.listenForGamepad, (state): IState['controller'] =>
        ({ ...state, connectionState: ControllerConnectionState.WaitingForConnect })
    ),
    on(ACTION_CONTROLLER_READ, (state, props): IState['controller'] => ({ ...state, controllerState: props })),
    on(ACTIONS_CONFIGURE_CONTROLLER.cancelListeningForGamepad, (state): IState['controller'] =>
        ({ ...state, connectionState: ControllerConnectionState.NotConnected })
    )
);
