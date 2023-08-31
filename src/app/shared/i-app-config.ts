import { InjectionToken, isDevMode } from '@angular/core';
import { LogLevel } from 'rxpoweredup';

export interface IAppConfig {
    readonly gamepadConnectionReadInterval: number;
    readonly gamepadAxisDefaultDeadZone: number;
    readonly hubBatteryPollInterval: number;
    readonly hubRssiPollInterval: number;
    readonly logLevel: LogLevel;
}

export const APP_CONFIG = new InjectionToken<IAppConfig>('APP_CONFIG', {
    factory: (): IAppConfig => ({
        gamepadConnectionReadInterval: 100,
        gamepadAxisDefaultDeadZone: 0.1,
        hubBatteryPollInterval: 20000,
        hubRssiPollInterval: 10000,
        logLevel: isDevMode() ? LogLevel.Debug : LogLevel.Warning,
    }),
    providedIn: 'root'
});
