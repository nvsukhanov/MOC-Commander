import { Provider } from '@angular/core';

import { ServoBindingTaskPayloadBuilderService } from './servo-binding-task-payload-builder.service';
import { ServoBindingFormBuilderService } from './servo-binding-form-builder.service';
import { ServoBindingFormMapperService } from './servo-binding-form-mapper.service';
import { ServoBindingInputExtractorService } from './servo-binding-input-extractor.service';
import { ServoBindingL10nService } from './servo-binding-l10n.service';

export function provideServoBinding(): Provider[] {
    return [
        ServoBindingTaskPayloadBuilderService,
        ServoBindingFormBuilderService,
        ServoBindingFormMapperService,
        ServoBindingInputExtractorService,
        ServoBindingL10nService
    ];
}
