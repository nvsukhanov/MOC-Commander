import { Store } from '@ngrx/store';
import { Observable, concatWith, map, takeUntil } from 'rxjs';
import { ValueTransformers } from 'rxpoweredup';
import { Injectable } from '@angular/core';
import { WidgetType } from '@app/shared-misc';
import { ControlSchemeWidgetsDataModel, HubStorageService, IWidgetReadTaskFactory, TemperatureWidgetConfigModel } from '@app/store';

@Injectable()
export class TemperatureWidgetReadTaskFactoryService implements IWidgetReadTaskFactory<TemperatureWidgetConfigModel> {
    public createReadTask(
        config: TemperatureWidgetConfigModel,
        store: Store,
        hubStorage: HubStorageService,
        schemeStop$: Observable<unknown>
    ): Observable<{
        widgetId: number;
        data: ControlSchemeWidgetsDataModel;
    }> {
        const hub = hubStorage.get(config.hubId);
        return hub.ports.getPortValue(config.portId, config.modeId, ValueTransformers.temperature).pipe(
            concatWith(hub.ports.portValueChanges(config.portId, config.modeId, config.valueChangeThreshold, ValueTransformers.temperature)),
            takeUntil(schemeStop$),
            map((temperature) => ({
                widgetId: config.id,
                data: {
                    widgetType: WidgetType.Temperature,
                    temperature
                }
            }))
        );
    }
}
