import { Injectable } from '@angular/core';
import { ControlSchemeBindingType } from '@app/shared';

import { PortCommandTask } from '../../../models';
import { ITaskFilter } from '../i-task-filter';
import { MostRecentTaskFilterService } from './most-recent-task-filter.service';
import { SetSpeedFilterService } from './set-speed-filter.service';
import { HashCompareFilterService } from './hash-compare-filter.service';

@Injectable()
export class TaskFilterService implements ITaskFilter {
    private readonly filters: { [k in ControlSchemeBindingType]: ITaskFilter<k> } = {
        [ControlSchemeBindingType.SetSpeed]: this.setSpeedFilter,
        [ControlSchemeBindingType.Servo]: this.hashCompareFilter,
        [ControlSchemeBindingType.SetAngle]: this.hashCompareFilter,
        [ControlSchemeBindingType.Stepper]: this.mostRecentTaskFilter,
        [ControlSchemeBindingType.SpeedShift]: this.hashCompareFilter,
        [ControlSchemeBindingType.AngleShift]: this.hashCompareFilter,
    };

    constructor(
        private readonly mostRecentTaskFilter: MostRecentTaskFilterService,
        private readonly setSpeedFilter: SetSpeedFilterService,
        private readonly hashCompareFilter: HashCompareFilterService
    ) {
    }

    public calculateNextPendingTask(
        currentTask: PortCommandTask | null,
        pendingTask: PortCommandTask | null,
        inputSliceTasks: Array<PortCommandTask>,
    ): PortCommandTask | null {
        const mostRecentTaskType = this.getMostRecentTaskType(inputSliceTasks);
        if (mostRecentTaskType === null) {
            return null;
        }
        const filteredQueue = this.filterQueue(inputSliceTasks, mostRecentTaskType) as Array<PortCommandTask<typeof mostRecentTaskType>>;
        const filter = this.filters[mostRecentTaskType] as ITaskFilter<typeof mostRecentTaskType>;
        return filter.calculateNextPendingTask(currentTask, pendingTask, filteredQueue);
    }

    private getMostRecentTaskType(
        tasks: PortCommandTask[]
    ): ControlSchemeBindingType | null {
        const mostRecentTask = tasks.reduce((acc, task) => {
            if (!acc || task.inputTimestamp > acc.inputTimestamp) {
                return task;
            }
            return acc;
        }, null as null | PortCommandTask);
        return mostRecentTask?.payload.bindingType ?? null;
    }

    private filterQueue<TBindingType extends ControlSchemeBindingType>(
        queue: PortCommandTask[],
        bindingType: TBindingType
    ): PortCommandTask<TBindingType>[] {
        return queue.filter((task): task is PortCommandTask<TBindingType> => task.payload.bindingType === bindingType);
    }
}
