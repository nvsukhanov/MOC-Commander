import { ConsoleLoggingService } from './console-logging.service';
import { IAppConfig } from '../i-app-config';

export class PrefixedConsoleLogger extends ConsoleLoggingService {
  constructor(
    private prefix: string,
    config: IAppConfig,
  ) {
    super(config);
  }

  public override debug(...debug: unknown[]): void {
    super.debug(this.prefix, ...debug);
  }

  public override info(...info: unknown[]): void {
    super.info(this.prefix, ...info);
  }

  public override warn(...warning: unknown[]): void {
    super.warn(this.prefix, ...warning);
  }
}
