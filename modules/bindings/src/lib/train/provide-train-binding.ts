import { Provider } from '@angular/core';

import { TrainBindingTaskPayloadBuilderService } from './train-binding-task-payload-builder.service';
import { TrainBindingFormBuilderService } from './train-binding-form-builder.service';
import { TrainBindingFormMapperService } from './train-binding-form-mapper.service';
import { TrainBindingInputExtractorService } from './train-binding-input-extractor.service';
import { TrainBindingL10nService } from './train-binding-l10n.service';

export function provideTrainBinding(): Provider[] {
  return [
    TrainBindingTaskPayloadBuilderService,
    TrainBindingFormBuilderService,
    TrainBindingFormMapperService,
    TrainBindingInputExtractorService,
    TrainBindingL10nService,
  ];
}
