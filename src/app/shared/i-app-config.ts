import { InjectionToken, isDevMode } from '@angular/core';
import { LogLevel } from '@nvsukhanov/rxpoweredup';

export interface IAppConfig {
    readonly gamepadReadInterval: number;
    readonly gamepadConnectionReadInterval: number;
    readonly hubBatteryPollInterval: number;
    readonly hubRssiPollInterval: number;
    readonly logLevel: LogLevel;
    readonly defaultAccelerationTimeMs: number;
    readonly defaultDecelerationTimeMs: number;
}

export const APP_CONFIG = new InjectionToken<IAppConfig>('APP_CONFIG', {
    factory: (): IAppConfig => ({
        gamepadReadInterval: 100,
        gamepadConnectionReadInterval: 100,
        hubBatteryPollInterval: 20000,
        hubRssiPollInterval: 10000,
        logLevel: isDevMode() ? LogLevel.Debug : LogLevel.Warning,
        defaultAccelerationTimeMs: 1000,
        defaultDecelerationTimeMs: 1000,
    }),
    providedIn: 'root'
});
