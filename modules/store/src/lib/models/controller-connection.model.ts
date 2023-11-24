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

export type HubControllerConnectionModel = {
    controllerId: string;
    controllerType: ControllerType.Hub;
};

export type ControllerConnectionModel = GamepadConnectionModel | KeyboardConnectionModel | HubControllerConnectionModel;