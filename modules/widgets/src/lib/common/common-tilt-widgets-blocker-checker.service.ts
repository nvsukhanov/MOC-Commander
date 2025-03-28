import { PortModeName } from 'rxpoweredup';
import { Injectable } from '@angular/core';

import { IWidgetBlockerChecker } from '../i-widget-blocker-checker';

@Injectable()
export class CommonTiltWidgetsBlockerCheckerService implements IWidgetBlockerChecker {
  public canBeUsedWithInputModes(portModes: PortModeName[]): boolean {
    return portModes.includes(PortModeName.position) && portModes.includes(PortModeName.impact);
  }
}
