import { Store } from '@ngrx/store';
import { Observable, concatWith, takeUntil } from 'rxjs';
import { ValueTransformers } from 'rxpoweredup';
import { WidgetType } from '@app/shared';

import { TemperatureWidgetConfigModel } from '../../../../models';
import { CONTROL_SCHEME_WIDGETS_DATA_ACTIONS } from '../../../../actions';
import { HubStorageService } from '../../../../hub-storage.service';

export function createTemperatureReaderTask(
    config: TemperatureWidgetConfigModel,
    store: Store,
    hubStorage: HubStorageService,
    schemeStop$: Observable<unknown>
): Observable<unknown> {
    return new Observable((subscriber) => {
        let initialValueReceived = false;
        const hub = hubStorage.get(config.hubId);
        hub.ports.getPortValue(config.portId, config.modeId, ValueTransformers.temperature).pipe(
            concatWith(hub.ports.portValueChanges(config.portId, config.modeId, config.valueChangeThreshold, ValueTransformers.temperature)),
            takeUntil(schemeStop$),
        ).subscribe((temperature) => {
            if (!initialValueReceived) {
                initialValueReceived = true;
                subscriber.next(null);
                subscriber.complete();
            }
            store.dispatch(CONTROL_SCHEME_WIDGETS_DATA_ACTIONS.updateWidgetData({
                widgetId: config.id,
                data: {
                    widgetType: WidgetType.Temperature,
                    temperature
                }
            }));
        });
    });
}
