import { Provider } from '@angular/core';

import { GearboxControlTaskPayloadBuilderService } from './gearbox-control-task-payload-builder.service';
import { GearboxControlTaskRunnerService } from './gearbox-control-task-runner.service';
import { GearboxControlBindingFormBuilderService } from './gearbox-control-binding-form-builder.service';
import { GearboxControlBindingFormMapperService } from './gearbox-control-binding-form-mapper.service';
import { GearboxInputExtractorService } from './gearbox-input-extractor.service';
import { GearboxL10nService } from './gearbox-l10n.service';

export function provideGearboxBinding(): Provider[] {
    return [
        GearboxControlTaskPayloadBuilderService,
        GearboxControlTaskRunnerService,
        GearboxControlBindingFormBuilderService,
        GearboxControlBindingFormMapperService,
        GearboxInputExtractorService,
        GearboxL10nService
    ];
}
