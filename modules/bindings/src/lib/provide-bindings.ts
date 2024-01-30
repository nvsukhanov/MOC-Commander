import { Provider } from '@angular/core';
import { TASK_FACTORY, TASK_FILTER, TASK_RUNNER } from '@app/store';
import { BINDING_DETAILS_EDIT_FORM_RENDERER_FACTORY, BINDING_VALIDATOR } from '@app/shared-control-schemes';
import { PORT_COMMAND_TASK_SUMMARY_BUILDER } from '@app/control-scheme-view';

import {
    GearboxControlBindingFormBuilderService,
    GearboxControlBindingFormMapperService,
    GearboxControlPortCommandTaskSummaryBuilderService,
    GearboxControlTaskPayloadBuilderService,
    GearboxControlTaskRunnerService
} from './gearbox';
import {
    SetSpeedBindingFormBuilderService,
    SetSpeedBindingFormMapperService,
    SetSpeedFilterService,
    SetSpeedPortCommandTaskSummaryBuilderService,
    SetSpeedTaskPayloadBuilderService,
    SetSpeedTaskRunnerService
} from './set-speed';
import {
    SetAngleBindingFormBuilderService,
    SetAngleBindingFormMapperService,
    SetAnglePortCommandTaskSummaryBuilderService,
    SetAngleTaskPayloadBuilderService,
    SetAngleTaskRunnerService
} from './set-angle';
import {
    TrainControlBindingFormBuilderService,
    TrainControlBindingFormMapperService,
    TrainControlPortCommandTaskSummaryBuilderService,
    TrainControlTaskPayloadBuilderService,
    TrainControlTaskRunnerService
} from './train-control';
import {
    StepperBindingFormBuilderService,
    StepperBindingFormMapperService,
    StepperPortCommandTaskSummaryBuilderService,
    StepperTaskPayloadBuilderService,
    StepperTaskRunnerService
} from './stepper';
import { BindingTaskFactoryService } from './binding-task-factory.service';
import {
    ServoBindingFormBuilderService,
    ServoBindingFormMapperService,
    ServoPortCommandTaskSummaryBuilderService,
    ServoTaskPayloadBuilderService,
    ServoTaskRunnerService
} from './servo';
import { BindingTaskRunnerService } from './binding-task-runner.service';
import { HashCompareFilterService, MostRecentTaskFilterService } from './common';
import { BindingTaskFilterService } from './binding-task-filter.service';
import { BindingTaskPayloadHashBuilderService } from './binding-task-payload-hash-builder.service';
import { BindingDetailsEditFormRendererFactoryService } from './binding-details-edit-form-renderer-factory.service';
import { BindingValidatorService } from './binding-validator.service';
import { BindingTaskSummaryBuilderService } from './binding-task-summary-builder.service';

export function provideBindings(): Provider[] {
    return [
        GearboxControlTaskPayloadBuilderService,
        SetSpeedTaskPayloadBuilderService,
        SetAngleTaskPayloadBuilderService,
        TrainControlTaskPayloadBuilderService,
        StepperTaskPayloadBuilderService,
        ServoTaskPayloadBuilderService,
        { provide: TASK_FACTORY, useClass: BindingTaskFactoryService },
        ServoTaskRunnerService,
        SetAngleTaskRunnerService,
        SetSpeedTaskRunnerService,
        TrainControlTaskRunnerService,
        StepperTaskRunnerService,
        GearboxControlTaskRunnerService,
        { provide: TASK_RUNNER, useClass: BindingTaskRunnerService },
        MostRecentTaskFilterService,
        SetSpeedFilterService,
        HashCompareFilterService,
        { provide: TASK_FILTER, useClass: BindingTaskFilterService },
        BindingTaskPayloadHashBuilderService,
        { provide: BINDING_DETAILS_EDIT_FORM_RENDERER_FACTORY, useClass: BindingDetailsEditFormRendererFactoryService },
        { provide: BINDING_VALIDATOR, useClass: BindingValidatorService },
        GearboxControlBindingFormBuilderService,
        SetSpeedBindingFormBuilderService,
        SetAngleBindingFormBuilderService,
        TrainControlBindingFormBuilderService,
        StepperBindingFormBuilderService,
        ServoBindingFormBuilderService,
        GearboxControlBindingFormMapperService,
        SetSpeedBindingFormMapperService,
        SetAngleBindingFormMapperService,
        TrainControlBindingFormMapperService,
        StepperBindingFormMapperService,
        ServoBindingFormMapperService,
        GearboxControlPortCommandTaskSummaryBuilderService,
        SetSpeedPortCommandTaskSummaryBuilderService,
        SetAnglePortCommandTaskSummaryBuilderService,
        TrainControlPortCommandTaskSummaryBuilderService,
        StepperPortCommandTaskSummaryBuilderService,
        ServoPortCommandTaskSummaryBuilderService,
        { provide: PORT_COMMAND_TASK_SUMMARY_BUILDER, useClass: BindingTaskSummaryBuilderService }
    ];
}
