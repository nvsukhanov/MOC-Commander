import { Provider } from '@angular/core';

import { TrainControlTaskPayloadBuilderService } from './train-control-task-payload-builder.service';
import { TrainControlTaskRunnerService } from './train-control-task-runner.service';
import { TrainControlBindingFormBuilderService } from './train-control-binding-form-builder.service';
import { TrainControlBindingFormMapperService } from './train-control-binding-form-mapper.service';
import { TrainControlPortCommandTaskSummaryBuilderService } from './train-control-port-command-task-summary-builder.service';
import { TrainControlTaskInputExtractorService } from './train-control-task-input-extractor.service';

export function provideTrainControlBinding(): Provider[] {
    return [
        TrainControlTaskPayloadBuilderService,
        TrainControlTaskRunnerService,
        TrainControlBindingFormBuilderService,
        TrainControlBindingFormMapperService,
        TrainControlPortCommandTaskSummaryBuilderService,
        TrainControlTaskInputExtractorService
    ];
}
