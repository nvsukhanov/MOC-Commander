import { ControlSchemeBinding } from '../../store';
import { PortCommandTask } from '../../common';

export interface IPortCommandTaskComposer {
    composeTask(
        binding: ControlSchemeBinding,
        inputValue: number,
    ): PortCommandTask | null;
}
