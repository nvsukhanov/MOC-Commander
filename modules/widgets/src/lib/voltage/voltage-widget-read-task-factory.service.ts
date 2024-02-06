import { Store } from '@ngrx/store';
import { Observable, concatWith, filter, map, switchMap, take, takeUntil } from 'rxjs';
import { ValueTransformers } from 'rxpoweredup';
import { Injectable } from '@angular/core';
import { WidgetType } from '@app/shared-misc';
import { ControlSchemeWidgetsDataModel, HUBS_SELECTORS, HubModel, HubStorageService, IWidgetReadTaskFactory, VoltageWidgetConfigModel } from '@app/store';

@Injectable()
export class VoltageWidgetReadTaskFactoryService implements IWidgetReadTaskFactory<VoltageWidgetConfigModel> {
    public createReadTask(
        config: VoltageWidgetConfigModel,
        store: Store,
        hubStorage: HubStorageService,
        schemeStop$: Observable<unknown>
    ): Observable<{
        widgetId: number;
        data: ControlSchemeWidgetsDataModel;
    }> {
        return store.select(HUBS_SELECTORS.selectHub(config.hubId)).pipe(
            take(1),
            filter((hubModel): hubModel is HubModel => !!hubModel),
            switchMap(({ hubType }) => {
                const hub = hubStorage.get(config.hubId);
                return hub.ports.getPortValue(config.portId, config.modeId, ValueTransformers.voltage(hubType)).pipe(
                    concatWith(hub.ports.portValueChanges(config.portId, config.modeId, config.valueChangeThreshold, ValueTransformers.voltage(hubType)))
                );
            }),
            takeUntil(schemeStop$),
            map((voltage) => ({
                widgetId: config.id,
                data: {
                    widgetType: WidgetType.Voltage,
                    voltage
                }
            }))
        );
    }

}
