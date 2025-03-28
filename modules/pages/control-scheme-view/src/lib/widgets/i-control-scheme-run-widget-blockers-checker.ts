import { Dictionary } from '@ngrx/entity';
import { PortModeName } from 'rxpoweredup';
import { InjectionToken } from '@angular/core';
import { AttachedIoModel, WidgetConfigModel } from '@app/store';

import { SchemeRunBlocker } from '../issues-section/run-blockers';

export interface IControlSchemeRunWidgetBlockersChecker<TConfig extends WidgetConfigModel = WidgetConfigModel> {
  getBlockers(
    widgetConfig: TConfig,
    attachedIos: Dictionary<AttachedIoModel>,
    portInputModes: Dictionary<PortModeName[]>,
    connectedHubIds: string[],
  ): SchemeRunBlocker[];
}

export const CONTROL_SCHEME_RUN_WIDGET_BLOCKERS_CHECKER = new InjectionToken<IControlSchemeRunWidgetBlockersChecker>('CONTROL_SCHEME_RUN_BLOCKERS_CHECKER');
