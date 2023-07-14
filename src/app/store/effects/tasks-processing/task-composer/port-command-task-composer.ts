import { IPortCommandTaskComposer } from './i-port-command-task-composer';
import { ControlSchemeBinding, PortCommandTask, PortCommandTaskPayload } from '../../../models';

export abstract class PortCommandTaskComposer<TPayload extends PortCommandTaskPayload> implements IPortCommandTaskComposer {
    private next?: PortCommandTaskComposer<PortCommandTaskPayload>;

    protected abstract composePayload(
        binding: ControlSchemeBinding,
        inputValue: number,
        motorEncoderOffset: number,
        previousTaskPayload: PortCommandTask | null
    ): TPayload | null;

    protected abstract calculatePayloadHash(
        payload: TPayload
    ): string;

    public composeTask(
        binding: ControlSchemeBinding,
        inputValue: number,
        motorEncoderOffset: number,
        lastExecutedTask: PortCommandTask | null
    ): PortCommandTask | null {
        const payload = this.composePayload(binding, inputValue, motorEncoderOffset, lastExecutedTask);
        if (payload) {
            return {
                hubId: binding.output.hubId,
                portId: binding.output.portId,
                bindingId: binding.id,
                payload,
                hash: this.calculateHash(binding, payload)
            };
        }
        if (this.next) {
            return this.next.composeTask(binding, inputValue, motorEncoderOffset, lastExecutedTask);
        }
        return null;
    }

    public setNext(
        next: PortCommandTaskComposer<PortCommandTaskPayload>
    ): PortCommandTaskComposer<PortCommandTaskPayload> {
        this.next = next;
        return next;
    }

    private calculateHash(
        binding: ControlSchemeBinding,
        payload: TPayload
    ): string {
        return `${binding.output.hubId}/${binding.output.portId}/${this.calculatePayloadHash(payload)}`;
    }
}
