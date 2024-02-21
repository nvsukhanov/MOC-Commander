import { Provider } from '@angular/core';

import { SetSpeedTaskPayloadBuilderService } from './set-speed-task-payload-builder.service';
import { SetSpeedTaskRunnerService } from './set-speed-task-runner.service';
import { SetSpeedFilterService } from './set-speed-filter.service';
import { SetSpeedBindingFormBuilderService } from './set-speed-binding-form-builder.service';
import { SetSpeedBindingFormMapperService } from './set-speed-binding-form-mapper.service';
import { SetSpeedPortCommandTaskSummaryBuilderService } from './set-speed-port-command-task-summary-builder.service';
import { SetSpeedInputExtractorService } from './set-speed-input-extractor.service';
import { SetSpeedControllerNameResolverService } from './set-speed-controller-name-resolver.service';

export function provideSetSpeedBinding(): Provider[] {
    return [
        SetSpeedTaskPayloadBuilderService,
        SetSpeedTaskRunnerService,
        SetSpeedFilterService,
        SetSpeedBindingFormBuilderService,
        SetSpeedBindingFormMapperService,
        SetSpeedPortCommandTaskSummaryBuilderService,
        SetSpeedInputExtractorService,
        SetSpeedControllerNameResolverService
    ];
}
