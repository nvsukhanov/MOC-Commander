import { Injectable } from '@angular/core';
import { ControlSchemeBindingType } from '@app/shared-misc';
import { ITaskFilter, PortCommandTask } from '@app/store';

import { IBindingTaskFilter } from './i-binding-task-filter';
import { HashCompareFilterService, MostRecentTaskFilterService } from './common';
import { SpeedFilterService } from './speed';

@Injectable()
export class BindingTaskFilterService implements ITaskFilter {
    private readonly filters: { [k in ControlSchemeBindingType]: IBindingTaskFilter<k> } = {
        [ControlSchemeBindingType.Speed]: this.speedFilter,
        [ControlSchemeBindingType.Servo]: this.hashCompareFilter,
        [ControlSchemeBindingType.SetAngle]: this.mostRecentTaskFilter,
        [ControlSchemeBindingType.Stepper]: this.mostRecentTaskFilter,
        [ControlSchemeBindingType.TrainControl]: this.hashCompareFilter,
        [ControlSchemeBindingType.GearboxControl]: this.hashCompareFilter,
    };

    constructor(
        private readonly mostRecentTaskFilter: MostRecentTaskFilterService,
        private readonly speedFilter: SpeedFilterService,
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
