import { ControllerType } from '@app/shared';

export type KeyboardSettings = {
    controllerType: ControllerType.Keyboard;
    captureNonAlphaNumerics: boolean;
};

export type GamepadAxisSettings = {
    activeZoneStart: number;
    activeZoneEnd: number;
    invert: boolean;
};

export type GamepadSettings = {
    controllerType: ControllerType.Gamepad;
    axisConfigs: { [k in string]: GamepadAxisSettings };
};

export type ControllerSettings = KeyboardSettings | GamepadSettings;
