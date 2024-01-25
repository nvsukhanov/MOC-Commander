import { InjectionToken } from '@angular/core';

export interface IControllersConfig {
    readonly gamepad: {
        readonly inputReadInterval: number;
        readonly defaultAxisActiveZoneStart: number;
        readonly defaultButtonActiveZoneStart: number;
        readonly defaultActivationThreshold: number;
    };
    readonly maxInputValue: number;
    readonly minInputValue: number;
    readonly nullInputValue: number;
}

export const CONTROLLERS_CONFIG = new InjectionToken<IControllersConfig>('CONTROLLERS_CONFIG', {
    factory: (): IControllersConfig => ({
        gamepad: {
            inputReadInterval: 1000 / 30,
            defaultAxisActiveZoneStart: 0.1,
            defaultButtonActiveZoneStart: 0.01,
            defaultActivationThreshold: 0.5
        },
        maxInputValue: 1,
        minInputValue: -1,
        nullInputValue: 0
    }),
    providedIn: 'root'
});
