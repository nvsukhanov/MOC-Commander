import { Provider } from '@angular/core';

import { SpeedTaskPayloadBuilderService } from './speed-task-payload-builder.service';
import { SpeedTaskRunnerService } from './speed-task-runner.service';
import { SpeedFilterService } from './speed-filter.service';
import { SpeedBindingFormBuilderService } from './speed-binding-form-builder.service';
import { SpeedBindingFormMapperService } from './speed-binding-form-mapper.service';
import { SpeedInputExtractorService } from './speed-input-extractor.service';
import { SpeedL10nService } from './speed-l10n.service';

export function provideSpeedBinding(): Provider[] {
    return [
        SpeedTaskPayloadBuilderService,
        SpeedTaskRunnerService,
        SpeedFilterService,
        SpeedBindingFormBuilderService,
        SpeedBindingFormMapperService,
        SpeedInputExtractorService,
        SpeedL10nService
    ];
}
