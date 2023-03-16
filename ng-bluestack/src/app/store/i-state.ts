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
    nameL10nKey?: keyof L10nService;
}

export type ControllerAxisConfig = {
    index: number;
    nameL10nKey?: keyof L10nService;
}

export type GamepadControllerConfig = {
    index: number | null;
    nameL10nKey?: keyof L10nService | null;
    axisGroups: Array<ControllerAxisConfig>;
    buttons: Array<GamepadButtonConfig>;
}

