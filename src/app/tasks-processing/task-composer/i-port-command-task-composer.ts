import { AttachedIoPropsModel, ControlSchemeBinding } from '../../store';
import { PortCommandTask } from '@app/shared';

export interface IPortCommandTaskComposer {
    composeTask(
        binding: ControlSchemeBinding,
        inputValue: number,
        ioState?: AttachedIoPropsModel,
        previousTask?: PortCommandTask,
    ): PortCommandTask | null;
}
