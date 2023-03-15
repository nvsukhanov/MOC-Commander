import { ControllerState, ControllerType } from '../types';

export interface IGamepadControllerState {
    isConnected: boolean;
    id: string | null;
    axes: { [name in string]: number };
    buttons: { [name in string]: boolean };
}

export interface IState {
    controllerConfig: {
        controllerType: ControllerType | null;
        gamepadController: IGamepadControllerState;
    };
    controllerState: ControllerState[];
}

export const INITIAL_STATE: IState = {
    controllerConfig: {
        controllerType: null,
        gamepadController: {
            isConnected: false,
            id: null,
            axes: {},
            buttons: {}
        }
    },
    controllerState: [],
}
