import { Inject, Injectable } from '@angular/core';
import { ILogger } from '@nvsukhanov/rxpoweredup';

import { PrefixedConsoleLogger } from './prefixed-console-logger';
import { APP_CONFIG, IAppConfig } from '../i-app-config';

@Injectable({ providedIn: 'root' })
export class PrefixedConsoleLoggerFactoryService {
    constructor(
        @Inject(APP_CONFIG) private readonly config: IAppConfig
    ) {
    }

    public create(
        prefix: string
    ): ILogger {
        return new PrefixedConsoleLogger(prefix, this.config);
    }
}
