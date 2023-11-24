import { Injectable, ViewContainerRef } from '@angular/core';
import { TiltWidgetConfigModel } from '@app/store';

import { ControlSchemeWidgetSettingsDescriptor } from '../widget-settings-container';
import { TiltSensorWidgetSettingsComponent } from './tilt-sensor-widget-settings';

@Injectable({ providedIn: 'root' })
export class TiltWidgetSettingsComponentFactoryService {
    public createWidgetSettings(
        container: ViewContainerRef,
        config: TiltWidgetConfigModel
    ): ControlSchemeWidgetSettingsDescriptor {
        const componentRef = container.createComponent(TiltSensorWidgetSettingsComponent);
        componentRef.setInput('config', config);
        return {
            get config(): TiltWidgetConfigModel | undefined {
                return componentRef.instance.config;
            },
            configChanges$: componentRef.instance.configChanges,
            destroy: () => componentRef.destroy(),
        };
    }
}
