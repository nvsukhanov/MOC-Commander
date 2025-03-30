import { Provider } from '@angular/core';

import { PowerBindingTaskPayloadBuilderService } from './power-binding-task-payload-builder.service';
import { PowerBindingFormBuilderService } from './power-binding-form-builder.service';
import { PowerBindingFormMapperService } from './power-binding-form-mapper.service';
import { PowerBindingInputExtractorService } from './power-binding-input-extractor.service';
import { PowerBindingL10nService } from './power-binding-l10n.service';

export function providePowerBinding(): Provider[] {
  return [
    PowerBindingTaskPayloadBuilderService,
    PowerBindingFormBuilderService,
    PowerBindingFormMapperService,
    PowerBindingInputExtractorService,
    PowerBindingL10nService,
  ];
}
