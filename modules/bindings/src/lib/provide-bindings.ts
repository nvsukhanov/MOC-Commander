import { Provider } from '@angular/core';
import { TASKS_INPUT_EXTRACTOR, TASK_FACTORY, TASK_FILTER, TASK_RUNNER } from '@app/store';
import {
    BINDING_CONTROLLER_INPUT_NAME_RESOLVER,
    BINDING_DETAILS_EDIT_FORM_RENDERER_FACTORY,
    BINDING_TYPE_TO_L10N_KEY_MAPPER,
    BINDING_VALIDATOR
} from '@app/shared-control-schemes';
import { BINDING_INPUT_NAME_RESOLVER, PORT_COMMAND_TASK_SUMMARY_BUILDER } from '@app/control-scheme-view';

import { provideGearboxBinding } from './gearbox';
import { provideSpeedBinding } from './speed';
import { provideSetAngleBinding } from './set-angle';
import { provideStepperBinding } from './stepper';
import { BindingTaskFactoryService } from './binding-task-factory.service';
import { provideServoBinding } from './servo';
import { BindingTaskRunnerService } from './binding-task-runner.service';
import { provideBindingCommonServices } from './common';
import { BindingTaskFilterService } from './binding-task-filter.service';
import { BindingDetailsEditFormRendererFactoryService } from './binding-details-edit-form-renderer-factory.service';
import { BindingValidatorService } from './binding-validator.service';
import { provideTrainControlBinding } from './train-control';
import { TaskInputComposer } from './task-input-composer';
import { BindingL10nService } from './binding-l10n.service';

export function provideBindings(): Provider[] {
    return [
        ...provideGearboxBinding(),
        ...provideServoBinding(),
        ...provideSetAngleBinding(),
        ...provideSpeedBinding(),
        ...provideStepperBinding(),
        ...provideTrainControlBinding(),
        ...provideBindingCommonServices(),
        { provide: TASK_FACTORY, useClass: BindingTaskFactoryService },
        { provide: TASK_RUNNER, useClass: BindingTaskRunnerService },
        { provide: TASK_FILTER, useClass: BindingTaskFilterService },
        { provide: BINDING_DETAILS_EDIT_FORM_RENDERER_FACTORY, useClass: BindingDetailsEditFormRendererFactoryService },
        { provide: BINDING_VALIDATOR, useClass: BindingValidatorService },
        { provide: PORT_COMMAND_TASK_SUMMARY_BUILDER, useClass: BindingL10nService },
        { provide: TASKS_INPUT_EXTRACTOR, useClass: TaskInputComposer },
        { provide: BINDING_CONTROLLER_INPUT_NAME_RESOLVER, useClass: BindingL10nService },
        { provide: BINDING_INPUT_NAME_RESOLVER, useClass: BindingL10nService },
        { provide: BINDING_TYPE_TO_L10N_KEY_MAPPER, useClass: BindingL10nService }
    ];
}
