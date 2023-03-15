import { ControllerState, ControllerType } from '../types';
import { L10nService } from '../l10n';

export enum ControllerConnectionState {
    NotConnected,
    WaitingForConnect,
    Connected
}

export interface IState {
    controller: {
        controllerType: ControllerType;
        connectionState: ControllerConnectionState;
        gamepadController: GamepadControllerConfig;
        controllerState: ControllerState[];
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

