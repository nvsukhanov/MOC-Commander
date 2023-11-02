import { Injectable } from '@angular/core';
import { WidgetConfigModel, WidgetType } from '@app/store';

@Injectable({ providedIn: 'root' })
export class WidgetDefaultConfigFactoryService {
    public createDefaultConfig( // TODO: use proper factories for each widget type
        widgetType: WidgetType,
        hubId?: string,
        portId?: number
    ): WidgetConfigModel {
        switch (widgetType) {
            case WidgetType.Voltage:
                if (!hubId || !portId) {
                    throw new Error('Hub ID and port ID must be specified');
                }
                return {
                    id: 0,
                    title: '',
                    widgetType: WidgetType.Voltage,
                    hubId,
                    portId,
                    modeId: 0,
                    valueChangeThreshold: 0.05,
                    width: 1,
                    height: 1,
                };
            case WidgetType.Tilt:
                if (!hubId || !portId) {
                    throw new Error('Hub ID and port ID must be specified');
                }
                return {
                    id: 0,
                    title: '',
                    widgetType: WidgetType.Tilt,
                    hubId,
                    portId,
                    modeId: 0,
                    valueChangeThreshold: 1,
                    width: 2,
                    height: 2,
                    invertYaw: false,
                    invertPitch: false,
                    invertRoll: false,
                };
        }
    }
}
