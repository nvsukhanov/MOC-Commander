import { Provider } from '@angular/core';

import { CommonTiltWidgetsReadTaskFactoryService } from './common-tilt-widgets-read-task-factory.service';
import { CommonTiltWidgetsFormBuilderService } from './common-tilt-widgets-form-builder.service';
import { CommonTiltWidgetsBlockerCheckerService } from './common-tilt-widgets-blocker-checker.service';
import { CommonTiltWidgetsConfigFactoryService } from './common-tilt-widgets-config-factory.service';
import { CommonTiltWidgetsSettingsComponentFactoryService } from './common-tilt-widgets-settings-component-factory.service';

export function provideCommonWidgetServices(): Provider[] {
  return [
    CommonTiltWidgetsReadTaskFactoryService,
    CommonTiltWidgetsFormBuilderService,
    CommonTiltWidgetsBlockerCheckerService,
    CommonTiltWidgetsConfigFactoryService,
    CommonTiltWidgetsSettingsComponentFactoryService,
  ];
}
