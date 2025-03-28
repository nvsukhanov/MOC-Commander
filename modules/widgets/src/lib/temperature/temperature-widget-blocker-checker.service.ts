import { Injectable } from '@angular/core';
import { PortModeName } from 'rxpoweredup';

import { IWidgetBlockerChecker } from '../i-widget-blocker-checker';

@Injectable()
export class TemperatureWidgetBlockerCheckerService implements IWidgetBlockerChecker {
  public canBeUsedWithInputModes(portModes: PortModeName[]): boolean {
    return portModes.includes(PortModeName.temperature);
  }
}
