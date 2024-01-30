import { Provider } from '@angular/core';

import { GearboxControlTaskPayloadBuilderService } from './gearbox-control-task-payload-builder.service';
import { GearboxControlTaskRunnerService } from './gearbox-control-task-runner.service';
import { GearboxControlBindingFormBuilderService } from './gearbox-control-binding-form-builder.service';
import { GearboxControlBindingFormMapperService } from './gearbox-control-binding-form-mapper.service';
import { GearboxControlPortCommandTaskSummaryBuilderService } from './gearbox-control-port-command-task-summary-builder.service';

export function provideGearboxBinding(): Provider[] {
    return [
        GearboxControlTaskPayloadBuilderService,
        GearboxControlTaskRunnerService,
        GearboxControlBindingFormBuilderService,
        GearboxControlBindingFormMapperService,
        GearboxControlPortCommandTaskSummaryBuilderService,
    ];
}
