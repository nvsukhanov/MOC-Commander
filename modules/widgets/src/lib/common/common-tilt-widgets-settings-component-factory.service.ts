import { Injectable, ViewContainerRef } from '@angular/core';
import { ControlSchemeWidgetSettingsDescriptor } from '@app/control-scheme-view';
import { WidgetType } from '@app/shared-misc';

import { CommonTiltWidgetSettingsComponent } from './tilt-widgets-settings';
import { UnifiedTiltWidgetConfig } from './unified-tilt-widget-config';

@Injectable()
export class CommonTiltWidgetsSettingsComponentFactoryService {
    private defaultWidgetNameL10nKeys: {[ k in UnifiedTiltWidgetConfig['widgetType'] ]: string} = {
        [WidgetType.Pitch]: 'controlScheme.widgets.pitch.defaultName',
        [WidgetType.Yaw]: 'controlScheme.widgets.yaw.defaultName',
        [WidgetType.Roll]: 'controlScheme.widgets.roll.defaultName',
    };

    public createWidgetSettings(
        container: ViewContainerRef,
        config: UnifiedTiltWidgetConfig
    ): ControlSchemeWidgetSettingsDescriptor {
        const componentRef = container.createComponent(CommonTiltWidgetSettingsComponent);
        componentRef.setInput('defaultNameL10nKey', this.defaultWidgetNameL10nKeys[config.widgetType]);
        componentRef.setInput('config', config);
        componentRef.setInput('widgetType', config.widgetType);
        return {
            get config(): UnifiedTiltWidgetConfig | undefined {
                return componentRef.instance.config;
            },
            configChanges$: componentRef.instance.configChanges,
            destroy: () => componentRef.destroy(),
        };
    }
}
