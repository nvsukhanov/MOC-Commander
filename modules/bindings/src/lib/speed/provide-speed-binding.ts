import { Provider } from '@angular/core';

import { SpeedBindingTaskPayloadBuilderService } from './speed-binding-task-payload-builder.service';
import { SpeedBindingFormBuilderService } from './speed-binding-form-builder.service';
import { SpeedBindingFormMapperService } from './speed-binding-form-mapper.service';
import { SpeedBindingInputExtractorService } from './speed-binding-input-extractor.service';
import { SpeedBindingL10nService } from './speed-binding-l10n.service';

export function provideSpeedBinding(): Provider[] {
    return [
        SpeedBindingTaskPayloadBuilderService,
        SpeedBindingFormBuilderService,
        SpeedBindingFormMapperService,
        SpeedBindingInputExtractorService,
        SpeedBindingL10nService
    ];
}
