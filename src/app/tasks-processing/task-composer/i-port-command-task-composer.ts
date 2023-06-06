import { PortCommandTask } from '@app/shared';
import { AttachedIOState, ControlSchemeBinding } from '../../store';

export interface IPortCommandTaskComposer {
    composeTask(
        binding: ControlSchemeBinding,
        inputValue: number,
        ioState?: AttachedIOState,
        previousTask?: PortCommandTask,
    ): PortCommandTask | null;
}
