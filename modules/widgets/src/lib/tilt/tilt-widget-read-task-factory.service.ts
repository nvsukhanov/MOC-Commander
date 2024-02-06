import { Store } from '@ngrx/store';
import { Observable, concatWith, map, takeUntil } from 'rxjs';
import { TiltData, ValueTransformers } from 'rxpoweredup';
import { Injectable } from '@angular/core';
import { WidgetType } from '@app/shared-misc';
import { ControlSchemeWidgetsDataModel, HubStorageService, IWidgetReadTaskFactory, TiltWidgetConfigModel } from '@app/store';

@Injectable()
export class TiltWidgetReadTaskFactoryService implements IWidgetReadTaskFactory<TiltWidgetConfigModel> {
    public createReadTask(
        config: TiltWidgetConfigModel,
        store: Store,
        hubStorage: HubStorageService,
        schemeStop$: Observable<unknown>
    ): Observable<{
        widgetId: number;
        data: ControlSchemeWidgetsDataModel;
    }> {
        const hub = hubStorage.get(config.hubId);
        const tiltThreshold: TiltData = {
            roll: config.valueChangeThreshold,
            pitch: config.valueChangeThreshold,
            yaw: config.valueChangeThreshold
        };
        return hub.ports.getPortValue(config.portId, config.modeId, ValueTransformers.tilt).pipe(
            concatWith(hub.ports.portValueChanges(config.portId, config.modeId, tiltThreshold, ValueTransformers.tilt)),
            takeUntil(schemeStop$),
            map((tilt) => {
                const transformedTilt: TiltData = {
                    roll: config.invertRoll ? -tilt.roll : tilt.roll,
                    pitch: config.invertPitch ? -tilt.pitch : tilt.pitch,
                    yaw: config.invertYaw ? -tilt.yaw : tilt.yaw
                };

                return {
                    widgetId: config.id,
                    data: {
                        widgetType: WidgetType.Tilt,
                        tilt: transformedTilt
                    }
                };
            })
        );
    }

}
