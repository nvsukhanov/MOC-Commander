import { Injectable, Type } from '@angular/core';
import { WidgetType } from '@app/store';

import { VoltageSensorWidgetSettingsComponent } from './voltage-sensor-widget-settings';
import { ControlSchemeWidgetSettingsComponentOfType, IControlSchemeWidgetSettingsComponentResolver } from '../widget-settings-container';
import { TiltSensorWidgetSettingsComponent } from './tilt-sensor-widget-settings';

@Injectable()
export class ControlSchemeWidgetSettingsComponentResolverService implements IControlSchemeWidgetSettingsComponentResolver {
    private readonly widgetSettingsResolveMap: { [k in WidgetType]?: Type<ControlSchemeWidgetSettingsComponentOfType<k>> } = {
        [WidgetType.Voltage]: VoltageSensorWidgetSettingsComponent,
        [WidgetType.Tilt]: TiltSensorWidgetSettingsComponent,
    };

    public resolveWidgetSettings<T extends WidgetType>(
        widgetType: T
    ): Type<ControlSchemeWidgetSettingsComponentOfType<T>> | undefined {
        return this.widgetSettingsResolveMap[widgetType];
    }
}
