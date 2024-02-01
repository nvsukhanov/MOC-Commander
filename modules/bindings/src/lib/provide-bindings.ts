import { Provider } from '@angular/core';
import { TASKS_INPUT_EXTRACTOR, TASK_FACTORY, TASK_FILTER, TASK_RUNNER } from '@app/store';
import { BINDING_DETAILS_EDIT_FORM_RENDERER_FACTORY, BINDING_VALIDATOR } from '@app/shared-control-schemes';
import { PORT_COMMAND_TASK_SUMMARY_BUILDER } from '@app/control-scheme-view';

import { provideGearboxBinding } from './gearbox';
import { provideSetSpeedBinding } from './set-speed';
import { provideSetAngleBinding } from './set-angle';
import { provideStepperBinding } from './stepper';
import { BindingTaskFactoryService } from './binding-task-factory.service';
import { provideServoBinding } from './servo';
import { BindingTaskRunnerService } from './binding-task-runner.service';
import { provideBindingCommonServices } from './common';
import { BindingTaskFilterService } from './binding-task-filter.service';
import { BindingDetailsEditFormRendererFactoryService } from './binding-details-edit-form-renderer-factory.service';
import { BindingValidatorService } from './binding-validator.service';
import { BindingTaskSummaryBuilderService } from './binding-task-summary-builder.service';
import { provideTrainControlBinding } from './train-control';
import { TaskInputComposer } from './task-input-composer';

export function provideBindings(): Provider[] {
    return [
        ...provideGearboxBinding(),
        ...provideServoBinding(),
        ...provideSetAngleBinding(),
        ...provideSetSpeedBinding(),
        ...provideStepperBinding(),
        ...provideTrainControlBinding(),
        ...provideBindingCommonServices(),
        { provide: TASK_FACTORY, useClass: BindingTaskFactoryService },
        { provide: TASK_RUNNER, useClass: BindingTaskRunnerService },
        { provide: TASK_FILTER, useClass: BindingTaskFilterService },
        { provide: BINDING_DETAILS_EDIT_FORM_RENDERER_FACTORY, useClass: BindingDetailsEditFormRendererFactoryService },
        { provide: BINDING_VALIDATOR, useClass: BindingValidatorService },
        { provide: PORT_COMMAND_TASK_SUMMARY_BUILDER, useClass: BindingTaskSummaryBuilderService },
        { provide: TASKS_INPUT_EXTRACTOR, useClass: TaskInputComposer }
    ];
}
