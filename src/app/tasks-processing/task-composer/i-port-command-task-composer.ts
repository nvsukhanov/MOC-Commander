import { PortCommandTask } from '@app/shared';
import { AttachedIoProps, ControlSchemeBinding } from '../../store';

export interface IPortCommandTaskComposer {
    composeTask(
        binding: ControlSchemeBinding,
        inputValue: number,
        ioState?: AttachedIoProps,
        previousTask?: PortCommandTask,
    ): PortCommandTask | null;
}
