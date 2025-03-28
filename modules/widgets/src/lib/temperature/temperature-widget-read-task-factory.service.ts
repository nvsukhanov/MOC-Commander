import { Observable, concatWith, map, takeUntil } from 'rxjs';
import { ValueTransformers } from 'rxpoweredup';
import { Injectable } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { WidgetType } from '@app/shared-misc';
import { CONTROL_SCHEME_ACTIONS, ControlSchemeWidgetsDataModel, HubStorageService, TemperatureWidgetConfigModel } from '@app/store';

import { IWidgetReadTaskFactory } from '../i-widget-read-task-factory';

@Injectable()
export class TemperatureWidgetReadTaskFactoryService implements IWidgetReadTaskFactory<TemperatureWidgetConfigModel> {
  constructor(
    private readonly hubStorage: HubStorageService,
    private readonly actions: Actions,
  ) {}

  public createReadTask(config: TemperatureWidgetConfigModel): Observable<{
    widgetId: number;
    data: ControlSchemeWidgetsDataModel;
  }> {
    const hub = this.hubStorage.get(config.hubId);
    return hub.ports.getPortValue(config.portId, config.modeId, ValueTransformers.temperature).pipe(
      concatWith(hub.ports.portValueChanges(config.portId, config.modeId, config.valueChangeThreshold, ValueTransformers.temperature)),
      takeUntil(this.actions.pipe(ofType(CONTROL_SCHEME_ACTIONS.schemeStopped))),
      map((temperature) => ({
        widgetId: config.id,
        data: {
          widgetType: WidgetType.Temperature,
          temperature,
        },
      })),
    );
  }
}
