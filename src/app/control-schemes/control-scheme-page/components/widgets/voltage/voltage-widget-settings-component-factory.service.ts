import { Injectable, ViewContainerRef } from '@angular/core';
import { VoltageWidgetConfigModel } from '@app/store';

import { ControlSchemeWidgetSettingsDescriptor } from '../../widget-settings-container';
import { VoltageSensorWidgetSettingsComponent } from './voltage-sensor-widget-settings';

@Injectable({ providedIn: 'root' })
export class VoltageWidgetSettingsComponentFactoryService {
    public createWidgetSettings(
        container: ViewContainerRef,
        config: VoltageWidgetConfigModel
    ): ControlSchemeWidgetSettingsDescriptor {
        const componentRef = container.createComponent(VoltageSensorWidgetSettingsComponent);
        componentRef.setInput('config', config);
        return {
            get config(): VoltageWidgetConfigModel | undefined {
                return componentRef.instance.config;
            },
            configChanges$: componentRef.instance.configChanges,
            destroy: () => componentRef.destroy(),
        };
    }
}
