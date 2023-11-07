import { Injectable } from '@angular/core';
import { WidgetConfigModel } from '@app/store';
import { WidgetType } from '@app/shared';

@Injectable({ providedIn: 'root' })
export class ControlSchemeWidgetDefaultConfigFactoryService {
    public createDefaultConfig(
        widgetType: WidgetType,
        hubId?: string,
        portId?: number,
        modeId?: number,
    ): WidgetConfigModel | null {
        switch (widgetType) {
            case WidgetType.Voltage:
                if (hubId === undefined || portId === undefined || modeId === undefined) {
                    return null;
                }
                return {
                    id: 0,
                    title: '',
                    widgetType: WidgetType.Voltage,
                    hubId,
                    portId,
                    modeId,
                    valueChangeThreshold: 0.05,
                    width: 1,
                    height: 1,
                };
            case WidgetType.Tilt:
                if (hubId === undefined || portId === undefined || modeId === undefined) {
                    return null;
                }
                return {
                    id: 0,
                    title: '',
                    widgetType: WidgetType.Tilt,
                    hubId,
                    portId,
                    modeId,
                    valueChangeThreshold: 5,
                    width: 2,
                    height: 2,
                    invertYaw: false,
                    invertPitch: false,
                    invertRoll: false,
                };
            case WidgetType.Temperature:
                if (hubId === undefined || portId === undefined || modeId === undefined) {
                    return null;
                }
                return {
                    id: 0,
                    title: '',
                    widgetType: WidgetType.Temperature,
                    hubId,
                    portId,
                    modeId,
                    valueChangeThreshold: 0.5,
                    width: 1,
                    height: 1,
                };
        }
    }
}
