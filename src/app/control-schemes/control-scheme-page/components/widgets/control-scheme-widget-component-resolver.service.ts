import { Injectable, Type } from '@angular/core';
import { WidgetType } from '@app/store';

import { VoltageSensorWidgetComponent } from './voltage-sensor-widget';
import { ControlSchemeWidgetComponentOfType } from '../widget-container';

@Injectable()
export class ControlSchemeWidgetComponentResolverService {
    private readonly widgetResolveMap: { [k in WidgetType]?: Type<ControlSchemeWidgetComponentOfType<k>> } = {
        [WidgetType.Voltage]: VoltageSensorWidgetComponent
    };

    public resolveWidget<T extends WidgetType>(
        widgetType: T
    ): Type<ControlSchemeWidgetComponentOfType<T>> | undefined {
        return this.widgetResolveMap[widgetType];
    }
}
