import { ControlSchemeBinding } from '../../store';
import { PortCommandTask } from '../../types/port-command-task';

export interface IPortCommandTaskComposer {
    composeTask(
        binding: ControlSchemeBinding,
        inputValue: number,
    ): PortCommandTask | null;
}
