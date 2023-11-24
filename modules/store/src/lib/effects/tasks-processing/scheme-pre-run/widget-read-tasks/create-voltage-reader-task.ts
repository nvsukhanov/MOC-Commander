import { Observable, concatWith, filter, switchMap, take, takeUntil } from 'rxjs';
import { Store } from '@ngrx/store';
import { ValueTransformers } from 'rxpoweredup';
import { WidgetType } from '@app/shared-misc';

import { HubModel, VoltageWidgetConfigModel } from '../../../../models';
import { CONTROL_SCHEME_WIDGETS_DATA_ACTIONS } from '../../../../actions';
import { HUBS_SELECTORS } from '../../../../selectors';
import { HubStorageService } from '../../../../hub-storage.service';

/**
 * Creates a task that setups port operation mode, reads initial voltage value and subscribes to voltage changes.
 * Received voltage values are dispatched to the store.
 * Observable completes when initial voltage value is received (as an indication of widget pre-run task completion),
 * but it is not unsubscribed from voltage changes until scheme is stopped.
 * @param config
 * @param store
 * @param hubStorage
 * @param schemeStop$
 */
export function createVoltageReaderTask(
    config: VoltageWidgetConfigModel,
    store: Store,
    hubStorage: HubStorageService,
    schemeStop$: Observable<unknown>
): Observable<unknown> {
    return new Observable((subscriber) => {
        let initialValueReceived = false;
        store.select(HUBS_SELECTORS.selectHub(config.hubId)).pipe(
            take(1),
            filter((hubModel): hubModel is HubModel => !!hubModel),
            switchMap(({ hubType }) => {
                const hub = hubStorage.get(config.hubId);
                return hub.ports.getPortValue(config.portId, config.modeId, ValueTransformers.voltage(hubType)).pipe(
                    concatWith(hub.ports.portValueChanges(config.portId, config.modeId, config.valueChangeThreshold, ValueTransformers.voltage(hubType)))
                );
            }),
            takeUntil(schemeStop$),
        ).subscribe((voltage) => {
            if (!initialValueReceived) {
                initialValueReceived = true;
                subscriber.next(null);
                subscriber.complete();
            }
            store.dispatch(CONTROL_SCHEME_WIDGETS_DATA_ACTIONS.updateWidgetData({
                widgetId: config.id,
                data: {
                    widgetType: WidgetType.Voltage,
                    voltage
                }
            }));
        });
    });
}
