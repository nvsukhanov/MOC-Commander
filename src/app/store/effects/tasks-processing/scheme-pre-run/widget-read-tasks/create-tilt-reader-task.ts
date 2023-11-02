import { Store } from '@ngrx/store';
import { Observable, concatWith, takeUntil } from 'rxjs';
import { TiltData } from 'rxpoweredup';

import { TiltWidgetConfigModel, WidgetType } from '../../../../models';
import { CONTROL_SCHEME_WIDGETS_DATA_ACTIONS } from '../../../../actions';
import { HubStorageService } from '../../../../hub-storage.service';

export function createTiltReaderTask(
    config: TiltWidgetConfigModel,
    store: Store,
    hubStorage: HubStorageService,
    schemeStop$: Observable<unknown>
): Observable<unknown> {
    return new Observable((subscriber) => {
        let initialValueReceived = false;
        const hub = hubStorage.get(config.hubId);
        hub.sensors.getTilt(config.portId, config.modeId).pipe(
            concatWith(hub.sensors.tiltChanges(config.portId, config.modeId, config.valueChangeThreshold)),
            takeUntil(schemeStop$),
        ).subscribe((tilt) => {
            if (!initialValueReceived) {
                initialValueReceived = true;
                subscriber.next(null);
                subscriber.complete();
            }
            const transformedTilt: TiltData = {
                roll: config.invertRoll ? -tilt.roll : tilt.roll,
                pitch: config.invertPitch ? -tilt.pitch : tilt.pitch,
                yaw: config.invertYaw ? -tilt.yaw : tilt.yaw
            };
            store.dispatch(CONTROL_SCHEME_WIDGETS_DATA_ACTIONS.updateWidgetData({
                widgetId: config.id,
                data: {
                    widgetType: WidgetType.Tilt,
                    tilt: transformedTilt
                }
            }));
        });
    });
}
