import { Provider } from '@angular/core';

import { AccelerateBindingTaskPayloadBuilderService } from './accelerate-binding-task-payload-builder.service';
import { AccelerateBindingFormBuilderService } from './accelerate-binding-form-builder.service';
import { AccelerateBindingFormMapperService } from './accelerate-binding-form-mapper.service';
import { AccelerateBindingInputExtractorService } from './accelerate-binding-input-extractor.service';
import { AccelerateBindingL10nService } from './accelerate-binding-l10n.service';

export function provideAccelerateBinding(): Provider[] {
    return [
        AccelerateBindingTaskPayloadBuilderService,
        AccelerateBindingFormBuilderService,
        AccelerateBindingFormMapperService,
        AccelerateBindingInputExtractorService,
        AccelerateBindingL10nService
    ];
}
