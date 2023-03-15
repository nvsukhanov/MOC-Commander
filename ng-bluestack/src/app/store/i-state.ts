import { ControllerState, ControllerType } from '../types';

export interface IState {
    controller: {
        controllerType: ControllerType | null;
        gamepadController: GamepadControllerConfig;
        controllerState: ControllerState[];
    }
}

export type ControllerAxisConfig = {
    index: number;
}

export type ControllerAxisGroup = {
    name: string;
    xAxis: ControllerAxisConfig;
    yAxis: ControllerAxisConfig;
}

export type GamepadControllerConfig = {
    isConnected: boolean;
    id: string | null;
    axes: ControllerAxisGroup[];
    buttons: { [name in string]: boolean };
}

