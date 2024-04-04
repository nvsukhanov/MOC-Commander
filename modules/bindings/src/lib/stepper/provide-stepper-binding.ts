import { Provider } from '@angular/core';

import { StepperBindingTaskPayloadBuilderService } from './stepper-binding-task-payload-builder.service';
import { StepperBindingFormBuilderService } from './stepper-binding-form-builder.service';
import { StepperBindingFormMapperService } from './stepper-binding-form-mapper.service';
import { StepperBindingInputExtractorService } from './stepper-binding-input-extractor.service';
import { StepperBindingL10nService } from './stepper-binding-l10n.service';

export function provideStepperBinding(): Provider[] {
    return [
        StepperBindingTaskPayloadBuilderService,
        StepperBindingFormBuilderService,
        StepperBindingFormMapperService,
        StepperBindingInputExtractorService,
        StepperBindingL10nService
    ];
}
