import { ControllerType } from './controller-type';

export type KeyboardSettings = {
    controllerType: ControllerType.Keyboard;
    captureNonAlphaNumerics: boolean;
};

export type GamepadAxisSettings = {
    activeZoneStart: number;
    activeZoneEnd: number;
    invert: boolean;
    ignoreInput: boolean;
    trim: number;
    activationThreshold: number;
    negativeValueCanActivate: boolean;
};

export type GamepadButtonSettings = {
    activeZoneStart: number;
    activeZoneEnd: number;
    ignoreInput: boolean;
    trim: number;
    activationThreshold: number;
    negativeValueCanActivate: boolean;
    invert: boolean;
};

export type GamepadSettings = {
    controllerType: ControllerType.Gamepad;
    axisConfigs: { [k in string]: GamepadAxisSettings };
    buttonConfigs: { [k in string]: GamepadButtonSettings };
};

export type HubControllerSettings = {
    controllerType: ControllerType.Hub;
};

export type ControllerSettings = KeyboardSettings | GamepadSettings | HubControllerSettings;
