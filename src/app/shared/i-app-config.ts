import { InjectionToken, isDevMode } from '@angular/core';
import { LogLevel, PortOperationStartupInformation } from 'rxpoweredup';

export interface IAppConfig {
    readonly gamepad: {
        readonly connectionReadInterval: number;
        readonly inputReadInterval: number;
        readonly defaultAxisActiveZoneStart: number;
        readonly defaultButtonActiveZoneStart: number;
        readonly defaultActivationThreshold: number;
    };
    readonly hubBatteryPollInterval: number;
    readonly hubRssiPollInterval: number;
    readonly logLevel: LogLevel;
    readonly messageSendTimeout: number;
    readonly maxMessageSendAttempts: number;
    readonly initialMessageSendRetryDelayMs: number;
    readonly defaultBufferingMode: PortOperationStartupInformation;
}

export const APP_CONFIG = new InjectionToken<IAppConfig>('APP_CONFIG', {
    factory: (): IAppConfig => ({
        gamepad: {
            connectionReadInterval: 100,
            inputReadInterval: 1000 / 30, // 30 FPS
            defaultAxisActiveZoneStart: 0.1,
            defaultButtonActiveZoneStart: 0.01,
            defaultActivationThreshold: 0.5
        },
        hubBatteryPollInterval: 20000,
        hubRssiPollInterval: 10000,
        logLevel: isDevMode() ? LogLevel.Debug : LogLevel.Warning,
        messageSendTimeout: 500,
        maxMessageSendAttempts: 5,
        initialMessageSendRetryDelayMs: 100,
        defaultBufferingMode: PortOperationStartupInformation.executeImmediately
    }),
    providedIn: 'root'
});
