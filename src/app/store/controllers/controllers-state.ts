import { EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import { ControllerType } from '../../plugins';

export type GamepadController = {
    id: string;
    controllerType: ControllerType.Gamepad;
    gamepadIndex: number;
    axesCount: number;
    buttonsCount: number;
    triggerButtonIndices: number[];
}

export type KeyboardController = {
    id: string;
    controllerType: ControllerType.Keyboard;
}

export type Controller = GamepadController | KeyboardController;

export const CONTROLLERS_ENTITY_ADAPTER: EntityAdapter<Controller> = createEntityAdapter<Controller>({
    selectId: (controller) => controllerIdFn(controller),
});

export function controllerIdFn(
    idArgs: { id: string, controllerType: ControllerType.Gamepad, gamepadIndex: number } | { controllerType: ControllerType.Keyboard }
): string {
    if (idArgs.controllerType === ControllerType.Gamepad) {
        return `${idArgs.id}/${idArgs.controllerType}/${idArgs.gamepadIndex}`;
    } else {
        return KEYBOARD_CONTROLLER_ID;
    }
}

export const CONTROLLERS_INITIAL_STATE = CONTROLLERS_ENTITY_ADAPTER.getInitialState();

export const KEYBOARD_CONTROLLER_ID = 'keyboard';
