import { InjectionToken, isDevMode } from '@angular/core';
import { LogLevel, MOTOR_LIMITS, PortOperationStartupInformation } from 'rxpoweredup';

export interface IAppConfig {
    readonly hubBatteryPollInterval: number;
    readonly hubRssiPollInterval: number;
    readonly logLevel: LogLevel;
    readonly messageSendTimeout: number;
    readonly maxMessageSendAttempts: number;
    readonly initialMessageSendRetryDelayMs: number;
    readonly defaultBufferingMode: PortOperationStartupInformation;
    readonly schemeStartStopTimeoutMs: number;
    readonly servo: {
        readonly defaultServoRange: number;
        readonly minServoRange: number;
        readonly maxServoRange: number;
        readonly manualCalibrationRuns: number;
        readonly autoCalibrationRuns: number;
        readonly aposCenterMin: number;
        readonly aposCenterMax: number;
        // 0.05 means 5% reduction. Used to reduce straining on the servo motor at the ends of the range.
        readonly calibrationRangeResultReductionFactor: number;
    };
    readonly acceleration: {
        defaultAccelerationStep: number;
    };
}

export const APP_CONFIG = new InjectionToken<IAppConfig>('APP_CONFIG', {
    factory: (): IAppConfig => ({
        hubBatteryPollInterval: 20000,
        hubRssiPollInterval: 10000,
        logLevel: isDevMode() ? LogLevel.Debug : LogLevel.Warning,
        messageSendTimeout: 500,
        maxMessageSendAttempts: 5,
        initialMessageSendRetryDelayMs: 100,
        defaultBufferingMode: PortOperationStartupInformation.executeImmediately,
        schemeStartStopTimeoutMs: 10000,
        servo: {
            defaultServoRange: MOTOR_LIMITS.maxServoDegreesRange,
            minServoRange: MOTOR_LIMITS.minServoDegreesRange,
            maxServoRange: MOTOR_LIMITS.maxServoDegreesRange * 4, // 2 full rotations in degrees in each direction
            manualCalibrationRuns: 2,
            autoCalibrationRuns: 1,
            aposCenterMin: -MOTOR_LIMITS.maxServoDegreesRange / 2,
            aposCenterMax: MOTOR_LIMITS.maxServoDegreesRange / 2,
            calibrationRangeResultReductionFactor: 0.05
        },
        acceleration: {
            defaultAccelerationStep: 10
        }
    }),
    providedIn: 'root'
});
