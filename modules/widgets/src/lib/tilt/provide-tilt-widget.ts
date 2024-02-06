import { Provider } from '@angular/core';

import { TiltWidgetComponentFactoryService } from './tilt-widget-component-factory.service';
import { TiltWidgetConfigFactoryService } from './tilt-widget-config-factory.service';
import { TiltWidgetReadTaskFactoryService } from './tilt-widget-read-task-factory.service';
import { TiltWidgetSettingsComponentFactoryService } from './tilt-widget-settings-component-factory.service';
import { TiltWidgetBlockerCheckerService } from './tilt-widget-blocker-checker.service';

export function provideTiltWidget(): Provider[] {
    return [
        TiltWidgetComponentFactoryService,
        TiltWidgetConfigFactoryService,
        TiltWidgetBlockerCheckerService,
        TiltWidgetReadTaskFactoryService,
        TiltWidgetSettingsComponentFactoryService
    ];
}
