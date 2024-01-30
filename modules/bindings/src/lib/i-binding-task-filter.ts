import { ControlSchemeBindingType } from '@app/shared-misc';
import { PortCommandTask } from '@app/store';

export interface IBindingTaskFilter<TBindingType extends ControlSchemeBindingType = ControlSchemeBindingType> {
    calculateNextPendingTask(
        currentTask: PortCommandTask | null,
        pendingTask: PortCommandTask | null,
        inputSliceTasks: Array<PortCommandTask<TBindingType>>,
    ): PortCommandTask | null;
}
