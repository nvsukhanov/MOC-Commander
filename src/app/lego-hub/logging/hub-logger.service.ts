import { ConsoleLoggingService, ILogger } from '../../common';

export class HubLogger implements ILogger {
    constructor(
        private readonly deviceId: string,
        private readonly logger: ConsoleLoggingService
    ) {
    }

    public debug(...debug: unknown[]): void {
        this.logger.debug(`[${this.deviceId}]`, ...debug);
    }

    public error(error: Error | string): void {
        this.logger.error(error);
    }

    public info(...info: unknown[]): void {
        this.logger.info(`[${this.deviceId}]`, ...info);
    }

    public warning(...warning: unknown[]): void {
        this.logger.warning(`[${this.deviceId}]`, ...warning);
    }
}
