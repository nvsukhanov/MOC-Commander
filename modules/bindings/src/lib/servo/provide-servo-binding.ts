import { Provider } from '@angular/core';

import { ServoTaskPayloadBuilderService } from './servo-task-payload-builder.service';
import { ServoTaskRunnerService } from './servo-task-runner.service';
import { ServoBindingFormBuilderService } from './servo-binding-form-builder.service';
import { ServoBindingFormMapperService } from './servo-binding-form-mapper.service';
import { ServoPortCommandTaskSummaryBuilderService } from './servo-port-command-task-summary-builder.service';

export function provideServoBinding(): Provider[] {
    return [
        ServoTaskPayloadBuilderService,
        ServoTaskRunnerService,
        ServoBindingFormBuilderService,
        ServoBindingFormMapperService,
        ServoPortCommandTaskSummaryBuilderService,
    ];
}
