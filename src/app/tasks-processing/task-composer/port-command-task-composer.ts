import { PortCommandTask } from '@app/shared';
import { IPortCommandTaskComposer } from './i-port-command-task-composer';
import { AttachedIoProps, ControlSchemeBinding } from '../../store';

export abstract class PortCommandTaskComposer implements IPortCommandTaskComposer {
    private next?: PortCommandTaskComposer;

    protected abstract handle(
        binding: ControlSchemeBinding,
        inputValue: number,
        ioState: AttachedIoProps,
        previousTask?: PortCommandTask,
    ): PortCommandTask | null;

    public composeTask(
        binding: ControlSchemeBinding,
        inputValue: number,
        ioState: AttachedIoProps,
        previousTask?: PortCommandTask,
    ): PortCommandTask | null {
        const result = this.handle(binding, inputValue, ioState, previousTask);
        if (result) {
            return result;
        }
        if (this.next) {
            return this.next.composeTask(binding, inputValue, ioState, previousTask);
        }
        return null;
    }

    public setNext(next: PortCommandTaskComposer): PortCommandTaskComposer {
        this.next = next;
        return next;
    }
}
