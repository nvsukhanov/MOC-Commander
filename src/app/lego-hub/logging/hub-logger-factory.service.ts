import { Injectable } from '@angular/core';
import { HubLogger } from './hub-logger.service';
import { ConsoleLoggingService, ILogger } from '../../logging';

@Injectable()
export class HubLoggerFactoryService {
    constructor(
        private readonly logger: ConsoleLoggingService
    ) {
    }

    public createHubLogger(
        deviceId: string
    ): ILogger {
        return new HubLogger(deviceId, this.logger);
    }
}
