import { InjectionToken } from '@angular/core';
import { ControlSchemeBindingType } from '@app/shared-misc';

import { PortCommandTask } from '../../models';

export interface ITaskFilter<TBindingType extends ControlSchemeBindingType = ControlSchemeBindingType> {
    calculateNextPendingTask(
        currentTask: PortCommandTask | null,
        pendingTask: PortCommandTask | null,
        inputSliceTasks: Array<PortCommandTask<TBindingType>>,
    ): PortCommandTask | null;
}

export const TASK_FILTER = new InjectionToken<ITaskFilter>('TASK_FILTER');
