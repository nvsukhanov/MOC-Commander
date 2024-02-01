import { Provider } from '@angular/core';

import { SetAngleTaskPayloadBuilderService } from './set-angle-task-payload-builder.service';
import { SetAngleTaskRunnerService } from './set-angle-task-runner.service';
import { SetAngleBindingFormBuilderService } from './set-angle-binding-form-builder.service';
import { SetAngleBindingFormMapperService } from './set-angle-binding-form-mapper.service';
import { SetAnglePortCommandTaskSummaryBuilderService } from './set-angle-port-command-task-summary-builder.service';
import { SetAngleInputExtractorService } from './set-angle-input-extractor.service';

export function provideSetAngleBinding(): Provider[] {
    return [
        SetAngleTaskPayloadBuilderService,
        SetAngleTaskRunnerService,
        SetAngleBindingFormBuilderService,
        SetAngleBindingFormMapperService,
        SetAnglePortCommandTaskSummaryBuilderService,
        SetAngleInputExtractorService
    ];
}
