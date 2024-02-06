import { Provider } from '@angular/core';

import { VoltageWidgetComponentFactoryService } from './voltage-widget-component-factory.service';
import { VoltageWidgetConfigFactoryService } from './voltage-widget-config-factory.service';
import { VoltageWidgetBlockerCheckerService } from './voltage-widget-blocker-checker.service';
import { VoltageWidgetReadTaskFactoryService } from './voltage-widget-read-task-factory.service';
import { VoltageWidgetSettingsComponentFactoryService } from './voltage-widget-settings-component-factory.service';

export function provideVoltageWidget(): Provider[] {
    return [
        VoltageWidgetComponentFactoryService,
        VoltageWidgetConfigFactoryService,
        VoltageWidgetBlockerCheckerService,
        VoltageWidgetReadTaskFactoryService,
        VoltageWidgetSettingsComponentFactoryService
    ];
}
