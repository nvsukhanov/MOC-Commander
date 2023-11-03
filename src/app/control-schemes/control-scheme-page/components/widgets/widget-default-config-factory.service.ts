import { Injectable } from '@angular/core';
import { AttachedIoModel, WidgetConfigModel, WidgetType } from '@app/store';

@Injectable({ providedIn: 'root' })
export class WidgetDefaultConfigFactoryService {
    public createDefaultConfig(
        widgetType: WidgetType,
        attacheIo: AttachedIoModel,
        modeId: number,
    ): WidgetConfigModel {
        switch (widgetType) {
            case WidgetType.Voltage:
                return {
                    id: 0,
                    title: '',
                    widgetType: WidgetType.Voltage,
                    hubId: attacheIo.hubId,
                    portId: attacheIo.portId,
                    modeId: modeId,
                    valueChangeThreshold: 0.05,
                    width: 1,
                    height: 1,
                };
            case WidgetType.Tilt:
                return {
                    id: 0,
                    title: '',
                    widgetType: WidgetType.Tilt,
                    hubId: attacheIo.hubId,
                    portId: attacheIo.portId,
                    modeId: modeId,
                    valueChangeThreshold: 5,
                    width: 2,
                    height: 2,
                    invertYaw: false,
                    invertPitch: false,
                    invertRoll: false,
                };
        }
    }
}
