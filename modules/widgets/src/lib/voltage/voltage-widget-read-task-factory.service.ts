import { Store } from '@ngrx/store';
import { Observable, concatWith, filter, map, switchMap, take, takeUntil } from 'rxjs';
import { ValueTransformers } from 'rxpoweredup';
import { Injectable } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { WidgetType } from '@app/shared-misc';
import { CONTROL_SCHEME_ACTIONS, ControlSchemeWidgetsDataModel, HUBS_SELECTORS, HubModel, HubStorageService, VoltageWidgetConfigModel } from '@app/store';

import { IWidgetReadTaskFactory } from '../i-widget-read-task-factory';

@Injectable()
export class VoltageWidgetReadTaskFactoryService implements IWidgetReadTaskFactory<VoltageWidgetConfigModel> {
    constructor(
        private readonly hubStorage: HubStorageService,
        private readonly actions: Actions,
        private readonly store: Store
    ) {
    }

    public createReadTask(
        config: VoltageWidgetConfigModel,
    ): Observable<{
        widgetId: number;
        data: ControlSchemeWidgetsDataModel;
    }> {
        return this.store.select(HUBS_SELECTORS.selectHub(config.hubId)).pipe(
            take(1),
            filter((hubModel): hubModel is HubModel => !!hubModel),
            switchMap(({ hubType }) => {
                const hub = this.hubStorage.get(config.hubId);
                return hub.ports.getPortValue(config.portId, config.modeId, ValueTransformers.voltage(hubType)).pipe(
                    concatWith(hub.ports.portValueChanges(config.portId, config.modeId, config.valueChangeThreshold, ValueTransformers.voltage(hubType)))
                );
            }),
            takeUntil(this.actions.pipe(
                ofType(CONTROL_SCHEME_ACTIONS.schemeStopped)
            )),
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
