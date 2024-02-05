import { Injectable, ViewContainerRef } from '@angular/core';
import { TemperatureWidgetConfigModel } from '@app/store';

import { ControlSchemeWidgetSettingsDescriptor } from '../widget-settings-container';
import { TemperatureSensorWidgetSettingsComponent } from './temperature-sensor-widget-settings';

@Injectable({ providedIn: 'root' })
export class TemperatureWidgetSettingsComponentFactoryService {
    public createWidgetSettings(
        container: ViewContainerRef,
        config: TemperatureWidgetConfigModel
    ): ControlSchemeWidgetSettingsDescriptor {
        const componentRef = container.createComponent(TemperatureSensorWidgetSettingsComponent);
        componentRef.setInput('config', config);
        return {
            get config(): TemperatureWidgetConfigModel | undefined {
                return componentRef.instance.config;
            },
            configChanges$: componentRef.instance.configChanges,
            destroy: () => componentRef.destroy(),
        };
    }
}
