import { InjectionToken, isDevMode } from '@angular/core';
import { LogLevel } from 'rxpoweredup';

export interface IAppConfig {
    readonly gamepadConnectionReadInterval: number;
    readonly gamepadDefaultDeadZoneStart: number;
    readonly hubBatteryPollInterval: number;
    readonly hubRssiPollInterval: number;
    readonly logLevel: LogLevel;
    readonly messageSendTimeout: number;
    readonly maxMessageSendAttempts: number;
    readonly initialMessageSendRetryDelayMs: number;
}

export const APP_CONFIG = new InjectionToken<IAppConfig>('APP_CONFIG', {
    factory: (): IAppConfig => ({
        gamepadConnectionReadInterval: 100,
        gamepadDefaultDeadZoneStart: 0.1,
        hubBatteryPollInterval: 20000,
        hubRssiPollInterval: 10000,
        logLevel: isDevMode() ? LogLevel.Debug : LogLevel.Warning,
        messageSendTimeout: 200,
        maxMessageSendAttempts: 5,
        initialMessageSendRetryDelayMs: 100
    }),
    providedIn: 'root'
});
