import { Provider } from '@angular/core';

import { TemperatureWidgetComponentFactoryService } from './temperature-widget-component-factory.service';
import { TemperatureWidgetConfigFactoryService } from './temperature-widget-config-factory.service';
import { TemperatureWidgetBlockerCheckerService } from './temperature-widget-blocker-checker.service';
import { TemperatureWidgetReadTaskFactoryService } from './temperature-widget-read-task-factory.service';
import { TemperatureWidgetSettingsComponentFactoryService } from './temperature-widget-settings-component-factory.service';

export function provideTemperatureWidget(): Provider[] {
    return [
        TemperatureWidgetComponentFactoryService,
        TemperatureWidgetConfigFactoryService,
        TemperatureWidgetBlockerCheckerService,
        TemperatureWidgetReadTaskFactoryService,
        TemperatureWidgetSettingsComponentFactoryService
    ];
}
