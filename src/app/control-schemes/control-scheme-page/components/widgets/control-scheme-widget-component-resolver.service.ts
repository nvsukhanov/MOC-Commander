import { Injectable, Type } from '@angular/core';
import { WidgetType } from '@app/store';

import { VoltageSensorWidgetComponent } from './voltage-sensor-widget';
import { ControlSchemeWidgetComponentOfType, IControlSchemeWidgetComponentResolver } from '../widget-container';
import { TiltSensorWidgetComponent } from './tilt-sensor-widget';

@Injectable()
export class ControlSchemeWidgetComponentResolverService implements IControlSchemeWidgetComponentResolver {
    private readonly widgetResolveMap: { [k in WidgetType]?: Type<ControlSchemeWidgetComponentOfType<k>> } = {
        [WidgetType.Voltage]: VoltageSensorWidgetComponent,
        [WidgetType.Tilt]: TiltSensorWidgetComponent
    };

    public resolveWidget<T extends WidgetType>(
        widgetType: T
    ): Type<ControlSchemeWidgetComponentOfType<T>> | undefined {
        return this.widgetResolveMap[widgetType];
    }
}
