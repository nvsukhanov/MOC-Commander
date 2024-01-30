import { Provider } from '@angular/core';

import { StepperTaskPayloadBuilderService } from './stepper-task-payload-builder.service';
import { StepperTaskRunnerService } from './stepper-task-runner.service';
import { StepperBindingFormBuilderService } from './stepper-binding-form-builder.service';
import { StepperBindingFormMapperService } from './stepper-binding-form-mapper.service';
import { StepperPortCommandTaskSummaryBuilderService } from './stepper-port-command-task-summary-builder.service';

export function provideStepperBinding(): Provider[] {
    return [
        StepperTaskPayloadBuilderService,
        StepperTaskRunnerService,
        StepperBindingFormBuilderService,
        StepperBindingFormMapperService,
        StepperPortCommandTaskSummaryBuilderService,
    ];
}
