/* eslint-disable no-console */
import { Inject, Injectable, Optional } from '@angular/core';
import { LOG_LEVEL, LogLevel } from './log-levels';
import { ExtractTokenType } from '../types';
import { ILogger } from '@nvsukhanov/poweredup-api';

@Injectable({ providedIn: 'root' })
export class ConsoleLoggingService implements ILogger {
    constructor(
        @Optional() @Inject(LOG_LEVEL) private configuredLogLevel: ExtractTokenType<typeof LOG_LEVEL> = LogLevel.Info
    ) {
    }

    public debug(...debug: unknown[]): void {
        if (this.canWrite(LogLevel.Debug)) {
            console.debug(...debug);
        }
    }

    public log(...args: unknown[]): void {
        if (this.canWrite(LogLevel.Debug)) {
            console.log(...args);
        }
    }

    public info(...info: unknown[]): void {
        if (this.canWrite(LogLevel.Info)) {
            console.info(...info);
        }

    }

    public warn(...warning: unknown[]): void {
        if (this.canWrite(LogLevel.Warning)) {
            console.warn(...warning);
        }
    }

    public error(error: Error | string): void {
        if (this.canWrite(LogLevel.Error)) {
            console.error(error);
        }
    }

    private canWrite(level: LogLevel): boolean {
        return level >= this.configuredLogLevel;
    }
}
