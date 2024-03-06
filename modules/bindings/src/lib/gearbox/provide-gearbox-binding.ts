import { Provider } from '@angular/core';

import { GearboxBindingTaskPayloadBuilderService } from './gearbox-binding-task-payload-builder.service';
import { GearboxBindingTaskRunnerService } from './gearbox-binding-task-runner.service';
import { GearboxBindingFormBuilderService } from './gearbox-binding-form-builder.service';
import { GearboxBindingFormMapperService } from './gearbox-binding-form-mapper.service';
import { GearboxBindingInputExtractorService } from './gearbox-binding-input-extractor.service';
import { GearboxBindingL10nService } from './gearbox-binding-l10n.service';

export function provideGearboxBinding(): Provider[] {
    return [
        GearboxBindingTaskPayloadBuilderService,
        GearboxBindingTaskRunnerService,
        GearboxBindingFormBuilderService,
        GearboxBindingFormMapperService,
        GearboxBindingInputExtractorService,
        GearboxBindingL10nService
    ];
}
