import { Injectable, ViewContainerRef } from '@angular/core';
import { TiltWidgetConfigModel } from '@app/store';
import { ControlSchemeWidgetSettingsDescriptor } from '@app/control-scheme-view';

import { TiltSensorWidgetSettingsComponent } from './settings/tilt-sensor-widget-settings.component';

@Injectable()
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
