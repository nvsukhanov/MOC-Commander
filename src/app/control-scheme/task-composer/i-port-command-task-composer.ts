import { ControlSchemeBinding, HubIOState } from '../../store';
import { PortCommandTask } from './port-command-task';

export interface IPortCommandTaskComposer {
    composeTask(
        binding: ControlSchemeBinding,
        inputValue: number,
        currentState?: HubIOState
    ): PortCommandTask | null;
}
