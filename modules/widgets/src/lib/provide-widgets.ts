import { Provider } from '@angular/core';
import {
    CONTROL_SCHEME_RUN_WIDGET_BLOCKERS_CHECKER,
    CONTROL_SCHEME_WIDGET_COMPONENT_FACTORY,
    CONTROL_SCHEME_WIDGET_CONFIG_FACTORY,
    CONTROL_SCHEME_WIDGET_SETTINGS_COMPONENT_FACTORY,
    WIDGET_CONNECTION_INFO_PROVIDER
} from '@app/control-scheme-view';
import { WIDGET_TYPE_TO_L10N_KEY_MAPPER } from '@app/shared-control-schemes';
import { WIDGET_READ_TASKS_FACTORY } from '@app/store';

import { WidgetConnectionInfoL10nService } from './widget-connection-info-l10n.service';
import { provideTemperatureWidget } from './temperature/provide-temperature-widget';
import { provideVoltageWidget } from './voltage';
import { ControlSchemeStartWidgetBlockerCheckerService } from './control-scheme-start-widget-blocker-checker.service';
import { WidgetComponentFactoryService } from './widget-component-factory.service';
import { WidgetConfigFactoryService } from './widget-config-factory.service';
import { WidgetTypeToL10nKeyMapperService } from './widget-type-to-l10n-key-mapper.service';
import { WidgetSettingsComponentFactoryService } from './widget-settings-component-factory.service';
import { WidgetsReadTaskFactoryService } from './widgets-read-task-factory.service';
import { provideCommonWidgetServices } from './common';
import { providePitchWidget } from './pitch';
import { provideYawWidget } from './yaw';
import { provideRollWidget } from './roll';

export function provideWidgets(): Provider[] {
    return [
        WidgetConnectionInfoL10nService,
        ...provideTemperatureWidget(),
        ...provideVoltageWidget(),
        ...provideCommonWidgetServices(),
        ...providePitchWidget(),
        ...provideYawWidget(),
        ...provideRollWidget(),
        { provide: CONTROL_SCHEME_RUN_WIDGET_BLOCKERS_CHECKER, useClass: ControlSchemeStartWidgetBlockerCheckerService },
        { provide: CONTROL_SCHEME_WIDGET_COMPONENT_FACTORY, useClass: WidgetComponentFactoryService },
        { provide: CONTROL_SCHEME_WIDGET_CONFIG_FACTORY, useClass: WidgetConfigFactoryService },
        { provide: WIDGET_TYPE_TO_L10N_KEY_MAPPER, useClass: WidgetTypeToL10nKeyMapperService },
        { provide: CONTROL_SCHEME_WIDGET_SETTINGS_COMPONENT_FACTORY, useClass: WidgetSettingsComponentFactoryService },
        { provide: WIDGET_READ_TASKS_FACTORY, useClass: WidgetsReadTaskFactoryService },
        { provide: WIDGET_CONNECTION_INFO_PROVIDER, useClass: WidgetConnectionInfoL10nService }
    ];
}
