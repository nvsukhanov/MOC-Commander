import { Provider } from '@angular/core';
import { TASKS_INPUT_EXTRACTOR, TASK_FACTORY } from '@app/store';
import {
    BINDING_CONTROLLER_INPUT_NAME_RESOLVER,
    BINDING_DETAILS_EDIT_FORM_RENDERER_FACTORY,
    BINDING_TYPE_TO_L10N_KEY_MAPPER,
    BINDING_VALIDATOR
} from '@app/shared-control-schemes';
import { BINDING_INPUT_NAME_RESOLVER } from '@app/control-scheme-view';

import { provideGearboxBinding } from './gearbox';
import { provideSpeedBinding } from './speed';
import { provideSetAngleBinding } from './set-angle';
import { provideStepperBinding } from './stepper';
import { BindingTaskFactoryService } from './binding-task-factory.service';
import { provideServoBinding } from './servo';
import { provideBindingCommonServices } from './common';
import { BindingDetailsEditFormRendererFactoryService } from './binding-details-edit-form-renderer-factory.service';
import { BindingValidatorService } from './binding-validator.service';
import { provideTrainBinding } from './train';
import { BindingInputExtractorService } from './binding-input-extractor.service';
import { BindingL10nService } from './binding-l10n.service';

export function provideBindings(): Provider[] {
    return [
        ...provideGearboxBinding(),
        ...provideServoBinding(),
        ...provideSetAngleBinding(),
        ...provideSpeedBinding(),
        ...provideStepperBinding(),
        ...provideTrainBinding(),
        ...provideBindingCommonServices(),
        { provide: TASK_FACTORY, useClass: BindingTaskFactoryService },
        { provide: BINDING_DETAILS_EDIT_FORM_RENDERER_FACTORY, useClass: BindingDetailsEditFormRendererFactoryService },
        { provide: BINDING_VALIDATOR, useClass: BindingValidatorService },
        { provide: TASKS_INPUT_EXTRACTOR, useClass: BindingInputExtractorService },
        { provide: BINDING_CONTROLLER_INPUT_NAME_RESOLVER, useClass: BindingL10nService },
        { provide: BINDING_INPUT_NAME_RESOLVER, useClass: BindingL10nService },
        { provide: BINDING_TYPE_TO_L10N_KEY_MAPPER, useClass: BindingL10nService }
    ];
}
