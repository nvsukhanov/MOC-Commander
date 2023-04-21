import { IPortCommandTaskComposer } from './i-port-command-task-composer';
import { ControlSchemeBinding, HubIOState } from '../../store';
import { PortCommandTask } from './port-command-task';

export abstract class PortCommandTaskComposer implements IPortCommandTaskComposer {
    private next?: PortCommandTaskComposer;

    protected abstract handle(
        binding: ControlSchemeBinding,
        inputValue: number,
        currentState?: HubIOState,
    ): PortCommandTask | null;

    public composeTask(
        binding: ControlSchemeBinding,
        inputValue: number,
        currentState?: HubIOState,
    ): PortCommandTask | null {
        const result = this.handle(binding, inputValue, currentState);
        if (result) {
            return result;
        }
        if (this.next) {
            return this.next.composeTask(binding, inputValue, currentState);
        }
        return null;
    }

    public setNext(next: PortCommandTaskComposer): PortCommandTaskComposer {
        this.next = next;
        return next;
    }
}
