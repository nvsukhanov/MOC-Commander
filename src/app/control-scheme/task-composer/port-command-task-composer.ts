import { IPortCommandTaskComposer } from './i-port-command-task-composer';
import { ControlSchemeBinding } from '../../store';
import { PortCommandTask } from '../../types/port-command-task';

export abstract class PortCommandTaskComposer implements IPortCommandTaskComposer {
    private next?: PortCommandTaskComposer;

    protected abstract handle(
        binding: ControlSchemeBinding,
        inputValue: number,
    ): PortCommandTask | null;

    public composeTask(
        binding: ControlSchemeBinding,
        inputValue: number,
    ): PortCommandTask | null {
        const result = this.handle(binding, inputValue);
        if (result) {
            return result;
        }
        if (this.next) {
            return this.next.composeTask(binding, inputValue);
        }
        return null;
    }

    public setNext(next: PortCommandTaskComposer): PortCommandTaskComposer {
        this.next = next;
        return next;
    }
}
