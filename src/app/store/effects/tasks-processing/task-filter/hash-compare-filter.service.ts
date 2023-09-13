import { Injectable } from '@angular/core';
import { ControlSchemeBindingType } from '@app/shared';
import { PortCommandTask } from '@app/store';

import { ITaskFilter } from '../i-task-filter';

@Injectable()
export class HashCompareFilterService implements ITaskFilter<ControlSchemeBindingType> {
    public calculateNextPendingTask(
        currentTask: PortCommandTask | null,
        pendingTask: PortCommandTask | null,
        inputSliceTasks: Array<PortCommandTask>
    ): PortCommandTask | null {
        const latestInputSliceTask = inputSliceTasks.reduce((acc, task) => {
            if (!acc || task.inputTimestamp > acc.inputTimestamp) {
                return task;
            }
            return acc;
        }, null as PortCommandTask | null);
        if (!latestInputSliceTask) {
            return null;
        }
        if (currentTask && currentTask.hash === latestInputSliceTask.hash) {
            return null;
        }
        if (pendingTask && pendingTask.hash === latestInputSliceTask.hash) {
            return pendingTask;
        }
        return latestInputSliceTask;
    }
}
