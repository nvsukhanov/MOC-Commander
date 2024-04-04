import { InjectionToken } from '@angular/core';

import { PortCommandTask, TaskType } from '../../models';

export interface ITaskFilter<TTaskType extends TaskType = TaskType> {
    calculateNextPendingTask(
        currentTask: PortCommandTask | null,
        pendingTask: PortCommandTask | null,
        inputSliceTasks: Array<PortCommandTask<TTaskType>>,
    ): PortCommandTask | null;
}

export const TASK_FILTER = new InjectionToken<ITaskFilter>('TASK_FILTER');
