import { Injectable } from '@angular/core';
import { WidgetConfigModel, WidgetType } from '@app/store';

@Injectable({ providedIn: 'root' })
export class WidgetDefaultConfigFactoryService {
    public createDefaultConfig( // TODO: use proper factories for each widget type
        widgetType: WidgetType,
        hubId?: string,
        portId?: number
    ): Omit<WidgetConfigModel, 'id' | 'name'> {
        switch (widgetType) {
            case WidgetType.Voltage:
                if (!hubId || !portId) {
                    throw new Error('Hub ID and port ID must be specified');
                }
                return {
                    widgetType: WidgetType.Voltage,
                    hubId,
                    portId,
                    modeId: 0,
                    valueChangeThreshold: 0.05,
                };
        }
    }
}
