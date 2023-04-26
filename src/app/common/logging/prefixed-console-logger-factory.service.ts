import { Inject, Injectable, Optional } from '@angular/core';
import { ILogger } from './i-logger';
import { PrefixedConsoleLogger } from './prefixed-console-logger';
import { LOG_LEVEL, LogLevel } from './log-levels';
import { ExtractTokenType } from '../types';

@Injectable({ providedIn: 'root' })
export class PrefixedConsoleLoggerFactoryService {
    constructor(
        @Optional() @Inject(LOG_LEVEL) private configuredLogLevel: ExtractTokenType<typeof LOG_LEVEL> = LogLevel.Info
    ) {
    }

    public create(
        prefix: string
    ): ILogger {
        return new PrefixedConsoleLogger(prefix, this.configuredLogLevel);
    }
}
