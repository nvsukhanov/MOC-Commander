import { Injectable, Type } from '@angular/core';
import { WidgetType } from '@app/store';

import { VoltageSensorWidgetComponent } from './voltage';
import { ControlSchemeWidgetComponentOfType, IControlSchemeWidgetComponentResolver } from '../widget-container';
import { TiltSensorWidgetComponent } from './tilt';
import { TemperatureSensorWidgetComponent } from './temperature';

@Injectable()
export class ControlSchemeWidgetComponentResolverService implements IControlSchemeWidgetComponentResolver {
    private readonly widgetResolveMap: { [k in WidgetType]: Type<ControlSchemeWidgetComponentOfType<k>> } = {
        [WidgetType.Voltage]: VoltageSensorWidgetComponent,
        [WidgetType.Tilt]: TiltSensorWidgetComponent,
        [WidgetType.Temperature]: TemperatureSensorWidgetComponent
    };

    public resolveWidget<T extends WidgetType>(
        widgetType: T
    ): Type<ControlSchemeWidgetComponentOfType<T>> {
        return this.widgetResolveMap[widgetType];
    }
}
