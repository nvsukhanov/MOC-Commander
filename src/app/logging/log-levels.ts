import { InjectionToken } from '@angular/core';

export enum LogLevel {
    Debug,
    Info,
    Warning,
    Error
}

export const LOG_LEVEL = new InjectionToken<LogLevel>('LOG_LEVEL');
