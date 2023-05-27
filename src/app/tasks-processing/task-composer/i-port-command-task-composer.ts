import { AttachedIOState, ControlSchemeBinding } from '../../store';
import { PortCommandTask } from '../../common';

export interface IPortCommandTaskComposer {
    composeTask(
        binding: ControlSchemeBinding,
        inputValue: number,
        ioState?: AttachedIOState,
        previousTask?: PortCommandTask,
    ): PortCommandTask | null;
}
