import { Provider } from '@angular/core';
import { TASK_FILTER, TASK_RUNNER } from '@app/store';
import { PORT_COMMAND_TASK_SUMMARY_BUILDER } from '@app/shared-control-schemes';

import { TaskRunnerService } from './task-runner.service';
import { GearboxTaskL10nService, GearboxTaskRunnerService } from './gearbox';
import { SetAngleTaskL10nService, SetAngleTaskRunnerService } from './set-angle';
import { SpeedTaskFilterService, SpeedTaskL10nService, SpeedTaskRunnerService } from './speed';
import { StepperTaskL10nService, StepperTaskRunnerService } from './stepper';
import { TrainTaskL10nService, TrainTaskRunnerService } from './train';
import { HashCompareFilterService, MostRecentTaskFilterService } from './common';
import { TaskFilterService } from './task-filter.service';
import { TaskHashBuilderService } from './task-hash-builder.service';
import { TaskSummaryBuilderService } from './task-summary-builder.service';

export function provideTasks(): Provider[] {
    return [
        GearboxTaskRunnerService,
        SetAngleTaskRunnerService,
        SpeedTaskRunnerService,
        StepperTaskRunnerService,
        TrainTaskRunnerService,
        GearboxTaskL10nService,
        SetAngleTaskL10nService,
        SpeedTaskL10nService,
        StepperTaskL10nService,
        TrainTaskL10nService,
        { provide: TASK_RUNNER, useClass: TaskRunnerService },
        HashCompareFilterService,
        MostRecentTaskFilterService,
        SpeedTaskFilterService,
        TaskHashBuilderService,
        { provide: TASK_FILTER, useClass: TaskFilterService },
        { provide: PORT_COMMAND_TASK_SUMMARY_BUILDER, useClass: TaskSummaryBuilderService }
    ];
}
