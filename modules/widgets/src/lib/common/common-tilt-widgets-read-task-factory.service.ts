import { Observable, concatWith, map, takeUntil } from 'rxjs';
import { TiltData, ValueTransformers } from 'rxpoweredup';
import { Injectable } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { CONTROL_SCHEME_ACTIONS, ControlSchemeWidgetsDataModel, HubStorageService } from '@app/store';

import { IWidgetReadTaskFactory } from '../i-widget-read-task-factory';
import { UnifiedTiltWidgetConfig } from './unified-tilt-widget-config';

@Injectable()
export class CommonTiltWidgetsReadTaskFactoryService implements IWidgetReadTaskFactory<UnifiedTiltWidgetConfig> {
    constructor(
        private readonly hubStorage: HubStorageService,
        private readonly actions: Actions
    ) {
    }

    public createReadTask(
        config: UnifiedTiltWidgetConfig,
    ): Observable<{
        widgetId: number;
        data: ControlSchemeWidgetsDataModel;
    }> {
        const hub = this.hubStorage.get(config.hubId);
        const tiltThreshold: TiltData = {
            roll: config.valueChangeThreshold,
            pitch: config.valueChangeThreshold,
            yaw: config.valueChangeThreshold
        };
        return hub.ports.getPortValue(config.portId, config.modeId, ValueTransformers.tilt).pipe(
            concatWith(hub.ports.portValueChanges(config.portId, config.modeId, tiltThreshold, ValueTransformers.tilt)),
            takeUntil(this.actions.pipe(
                ofType(CONTROL_SCHEME_ACTIONS.schemeStopped)
            )),
            map((tilt) => {
                return {
                    widgetId: config.id,
                    data: {
                        widgetType: config.widgetType,
                        tilt: tilt
                    }
                };
            })
        );
    }
}
