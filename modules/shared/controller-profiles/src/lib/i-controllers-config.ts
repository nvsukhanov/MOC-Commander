import { InjectionToken } from '@angular/core';

export const CONTROLLER_MAX_INPUT_VALUE = 1;
export const CONTROLLER_MIN_INPUT_VALUE = -1;
export const CONTROLLER_NULL_INPUT_VALUE = 0;

export interface IControllersConfig {
  readonly gamepad: {
    readonly defaultAxisActiveZoneStart: number;
    readonly defaultButtonActiveZoneStart: number;
    readonly defaultActivationThreshold: number;
  };
}

export const CONTROLLERS_CONFIG = new InjectionToken<IControllersConfig>('CONTROLLERS_CONFIG', {
  factory: (): IControllersConfig => ({
    gamepad: {
      defaultAxisActiveZoneStart: 0.1,
      defaultButtonActiveZoneStart: 0.01,
      defaultActivationThreshold: 0.5,
    },
  }),
  providedIn: 'root',
});
