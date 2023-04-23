import { ControlSchemeBinding } from '../../store';
import { PortCommandTask } from './port-command-task';

export interface IPortCommandTaskComposer {
    composeTask(
        binding: ControlSchemeBinding,
        inputValue: number,
    ): PortCommandTask | null;
}
