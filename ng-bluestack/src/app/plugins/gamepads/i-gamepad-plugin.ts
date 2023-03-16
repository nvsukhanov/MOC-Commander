import { GamepadControllerConfig } from '../../store';
import { InjectionToken } from '@angular/core';

export interface IGamepadPlugin {
    controllerIdMatch(id: string): boolean;

    mapToDefaultConfig(v: Gamepad): GamepadControllerConfig;
}

export const GAMEPAD_PLUGIN = new InjectionToken<IGamepadPlugin>('GAMEPAD_PLUGIN');
