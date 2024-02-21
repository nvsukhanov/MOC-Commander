import { Provider } from '@angular/core';

import { StepperTaskPayloadBuilderService } from './stepper-task-payload-builder.service';
import { StepperTaskRunnerService } from './stepper-task-runner.service';
import { StepperBindingFormBuilderService } from './stepper-binding-form-builder.service';
import { StepperBindingFormMapperService } from './stepper-binding-form-mapper.service';
import { StepperPortCommandTaskSummaryBuilderService } from './stepper-port-command-task-summary-builder.service';
import { StepperInputExtractorService } from './stepper-input-extractor.service';
import { StepperControllerNameResolverService } from './stepper-controller-name-resolver.service';
import { StepperInputSummaryProviderService } from './stepper-input-summary-provider.service';

export function provideStepperBinding(): Provider[] {
    return [
        StepperTaskPayloadBuilderService,
        StepperTaskRunnerService,
        StepperBindingFormBuilderService,
        StepperBindingFormMapperService,
        StepperPortCommandTaskSummaryBuilderService,
        StepperInputExtractorService,
        StepperControllerNameResolverService,
        StepperInputSummaryProviderService
    ];
}
