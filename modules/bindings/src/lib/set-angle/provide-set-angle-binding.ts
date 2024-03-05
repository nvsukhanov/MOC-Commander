import { Provider } from '@angular/core';

import { SetAngleTaskPayloadBuilderService } from './set-angle-task-payload-builder.service';
import { SetAngleTaskRunnerService } from './set-angle-task-runner.service';
import { SetAngleBindingFormBuilderService } from './set-angle-binding-form-builder.service';
import { SetAngleBindingFormMapperService } from './set-angle-binding-form-mapper.service';
import { SetAngleInputExtractorService } from './set-angle-input-extractor.service';
import { SetAngleL10nService } from './set-angle-l10n.service';

export function provideSetAngleBinding(): Provider[] {
    return [
        SetAngleTaskPayloadBuilderService,
        SetAngleTaskRunnerService,
        SetAngleBindingFormBuilderService,
        SetAngleBindingFormMapperService,
        SetAngleInputExtractorService,
        SetAngleL10nService
    ];
}
