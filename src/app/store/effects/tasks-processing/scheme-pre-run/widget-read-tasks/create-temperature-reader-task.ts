import { Store } from '@ngrx/store';
import { Observable, concatWith, takeUntil } from 'rxjs';
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
        hub.sensors.getTemperature(config.portId, config.modeId).pipe(
            concatWith(hub.sensors.temperatureChanges(config.portId, config.modeId, config.valueChangeThreshold)),
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
