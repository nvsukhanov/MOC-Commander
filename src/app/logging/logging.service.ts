/* eslint-disable no-console */
import { Inject, Injectable, Optional } from '@angular/core';
import { LOG_LEVEL, LogLevel } from './log-levels';
import { ExtractTokenType } from '../types';

@Injectable({ providedIn: 'root' })
export class LoggingService {
    constructor(
        @Optional() @Inject(LOG_LEVEL) private configuredLogLevel: ExtractTokenType<typeof LOG_LEVEL> = LogLevel.Info
    ) {
    }

    public debug(...debug: unknown[]): void {
        if (this.canWrite(LogLevel.Debug)) {
            console.debug(...debug);
        }
    }

    public info(...info: unknown[]): void {
        if (this.canWrite(LogLevel.Info)) {
            console.info(...info);
        }

    }

    public warning(...warning: unknown[]): void {
        if (this.canWrite(LogLevel.Warning)) {
            console.warn(...warning);
        }
    }

    public error(...error: ReadonlyArray<unknown>): void {
        if (this.canWrite(LogLevel.Error)) {
            console.error(error);
        }
    }

    private canWrite(level: LogLevel): boolean {
        return level >= this.configuredLogLevel;
    }
}
