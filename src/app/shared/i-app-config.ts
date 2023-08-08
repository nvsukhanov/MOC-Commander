import { InjectionToken, isDevMode } from '@angular/core';
import { LogLevel } from '@nvsukhanov/rxpoweredup';

export interface IAppConfig {
    readonly gamepadConnectionReadInterval: number;
    readonly gamepadAxisDefaultDeadZone: number;
    readonly hubBatteryPollInterval: number;
    readonly hubRssiPollInterval: number;
    readonly logLevel: LogLevel;
    readonly defaultAccDecProfileTimeMs: number;
    readonly maxAccDecProfileTimeMs: number;
}

export const APP_CONFIG = new InjectionToken<IAppConfig>('APP_CONFIG', {
    factory: (): IAppConfig => ({
        gamepadConnectionReadInterval: 100,
        gamepadAxisDefaultDeadZone: 0.1,
        hubBatteryPollInterval: 20000,
        hubRssiPollInterval: 10000,
        logLevel: isDevMode() ? LogLevel.Debug : LogLevel.Warning,
        defaultAccDecProfileTimeMs: 100,
        maxAccDecProfileTimeMs: 10000,
    }),
    providedIn: 'root'
});
