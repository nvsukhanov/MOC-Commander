import { Injectable } from '@angular/core';
import { PortCommandTask } from '@app/store';

import { ITaskFilter } from '../i-task-filter';

@Injectable()
export class MostRecentTaskFilterService implements ITaskFilter {
    public calculateNextPendingTask(
        currentTask: PortCommandTask | null,
        pendingTask: PortCommandTask | null,
        inputSliceTasks: Array<PortCommandTask>,
    ): PortCommandTask | null {
        const mostRecentInputSliceTask = inputSliceTasks.reduce((acc, task) => {
            if (!acc || task.inputTimestamp > acc.inputTimestamp) {
                return task;
            }
            return acc;
        }, null as PortCommandTask | null);
        return mostRecentInputSliceTask ?? pendingTask;
    }

}
