import { Provider } from '@angular/core';

import { SetAngleBindingTaskPayloadBuilderService } from './set-angle-binding-task-payload-builder.service';
import { SetAngleBindingFormBuilderService } from './set-angle-binding-form-builder.service';
import { SetAngleBindingFormMapperService } from './set-angle-binding-form-mapper.service';
import { SetAngleBindingInputExtractorService } from './set-angle-binding-input-extractor.service';
import { SetAngleBindingL10nService } from './set-angle-binding-l10n.service';

export function provideSetAngleBinding(): Provider[] {
    return [
        SetAngleBindingTaskPayloadBuilderService,
        SetAngleBindingFormBuilderService,
        SetAngleBindingFormMapperService,
        SetAngleBindingInputExtractorService,
        SetAngleBindingL10nService
    ];
}
