import { Provider } from '@angular/core';

import { TrainControlTaskPayloadBuilderService } from './train-control-task-payload-builder.service';
import { TrainControlTaskRunnerService } from './train-control-task-runner.service';
import { TrainControlBindingFormBuilderService } from './train-control-binding-form-builder.service';
import { TrainControlBindingFormMapperService } from './train-control-binding-form-mapper.service';
import { TrainControlTaskInputExtractorService } from './train-control-task-input-extractor.service';
import { TrainControlL10nService } from './train-control-l10n.service';

export function provideTrainControlBinding(): Provider[] {
    return [
        TrainControlTaskPayloadBuilderService,
        TrainControlTaskRunnerService,
        TrainControlBindingFormBuilderService,
        TrainControlBindingFormMapperService,
        TrainControlTaskInputExtractorService,
        TrainControlL10nService
    ];
}
