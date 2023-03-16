import { ControllerAxisState, ControllerButtonState, ControllerType } from '../types';
import { L10nService } from '../l10n';

export enum ControllerConnectionState {
    NotConnected,
    WaitingForConnect,
    Connected
}

export type ControllerAxesState = {
    [index in number]: ControllerAxisState
};

export type ControllerButtonsState = {
    [index in number]: ControllerButtonState
};

export interface IState {
    controller: {
        controllerType: ControllerType;
        connectionState: ControllerConnectionState;
        gamepadConfig: GamepadControllerConfig;
        controllerState: {
            axes: ControllerAxesState,
            buttons: ControllerButtonsState
        };
    }
}

export type GamepadButtonConfig = {
    index: number;
    nameL10nKey: keyof L10nService;
}

export type ControllerAxisConfig = {
    index: number;
}

export type ControllerAxisGroup = {
    name: keyof L10nService;
    xAxis: ControllerAxisConfig;
    yAxis: ControllerAxisConfig;
}

export type ControllerSingularAxisGroup = {
    name: keyof L10nService;
    axis: ControllerAxisConfig;
}

export type GamepadControllerConfig = {
    index: number | null;
    nameL10nKey: keyof L10nService | null;
    axisGroups: Array<ControllerAxisGroup | ControllerSingularAxisGroup>;
    buttons: Array<GamepadButtonConfig>;
}

