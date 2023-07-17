import { ControllerType } from '@app/shared';

export type GamepadConnectionModel = {
    controllerId: string;
    controllerType: ControllerType.Gamepad;
    gamepadIndex: number;
};

export type KeyboardConnectionModel = {
    controllerId: string;
    controllerType: ControllerType.Keyboard;
};

export type ControllerConnectionModel = GamepadConnectionModel | KeyboardConnectionModel;
