import { Store } from '@ngrx/store';
import { Observable, concatWith, takeUntil } from 'rxjs';
import { TiltData, ValueTransformers } from 'rxpoweredup';
import { WidgetType } from '@app/shared';

import { TiltWidgetConfigModel } from '../../../../models';
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
        const tiltThreshold: TiltData = {
            roll: config.valueChangeThreshold,
            pitch: config.valueChangeThreshold,
            yaw: config.valueChangeThreshold
        };
        hub.ports.getPortValue(config.portId, config.modeId, ValueTransformers.tilt).pipe(
            concatWith(hub.ports.portValueChanges(config.portId, config.modeId, tiltThreshold, ValueTransformers.tilt)),
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
