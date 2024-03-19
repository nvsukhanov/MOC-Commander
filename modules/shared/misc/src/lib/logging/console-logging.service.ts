/* eslint-disable no-console */
import { Inject, Injectable } from '@angular/core';
import { ILogger, LogLevel } from 'rxpoweredup';

import { APP_CONFIG, IAppConfig } from '../i-app-config';

@Injectable({ providedIn: 'root' })
export class ConsoleLoggingService implements ILogger {
    constructor(
        @Inject(APP_CONFIG) private readonly config: IAppConfig
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
        return level >= this.config.logLevel;
    }
}
