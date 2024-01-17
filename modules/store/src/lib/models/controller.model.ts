import { ControllerType } from '@app/shared-misc';

export type GamepadControllerModel = {
    id: string;
    controllerType: ControllerType.Gamepad;
    axesCount: number;
    buttonsCount: number;
    triggerButtonIndices: number[];
    profileUid: string;
    gamepadOfTypeIndex: number;
    gamepadId: string;
};

export type KeyboardControllerModel = {
    id: string;
    controllerType: ControllerType.Keyboard;
    profileUid: string;
};

export type HubControllerModel = {
    id: string;
    controllerType: ControllerType.Hub;
    hubId: string;
    profileUid: string;
};

export type ControllerModel = GamepadControllerModel | KeyboardControllerModel | HubControllerModel;
