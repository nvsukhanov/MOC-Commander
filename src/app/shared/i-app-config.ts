import { InjectionToken, isDevMode } from '@angular/core';
import { LogLevel } from '@nvsukhanov/rxpoweredup';

export interface IAppConfig {
    readonly gamepadReadInterval: number;
    readonly gamepadConnectionReadInterval: number;
    readonly hubBatteryPollInterval: number;
    readonly hubRSSIPollInterval: number;
    readonly logLevel: LogLevel;
}

export const APP_CONFIG = new InjectionToken<IAppConfig>('APP_CONFIG', {
    factory: (): IAppConfig => ({
        gamepadReadInterval: 100,
        gamepadConnectionReadInterval: 100,
        hubBatteryPollInterval: 20000,
        hubRSSIPollInterval: 10000,
        logLevel: isDevMode() ? LogLevel.Debug : LogLevel.Warning
    }),
    providedIn: 'root'
});
