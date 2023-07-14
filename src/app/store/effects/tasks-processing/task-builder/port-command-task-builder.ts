import { IPortCommandTaskBuilder } from './i-port-command-task-builder';
import { ControlSchemeBinding, PortCommandTask, PortCommandTaskPayload } from '../../../models';

export abstract class PortCommandTaskBuilder<TPayload extends PortCommandTaskPayload> implements IPortCommandTaskBuilder {
    private next?: PortCommandTaskBuilder<PortCommandTaskPayload>;

    protected abstract buildPayload(
        binding: ControlSchemeBinding,
        inputValue: number,
        motorEncoderOffset: number,
        previousTaskPayload: PortCommandTask | null
    ): TPayload | null;

    protected abstract calculatePayloadHash(
        payload: TPayload
    ): string;

    public build(
        binding: ControlSchemeBinding,
        inputValue: number,
        motorEncoderOffset: number,
        lastExecutedTask: PortCommandTask | null
    ): PortCommandTask | null {
        const payload = this.buildPayload(binding, inputValue, motorEncoderOffset, lastExecutedTask);
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
            return this.next.build(binding, inputValue, motorEncoderOffset, lastExecutedTask);
        }
        return null;
    }

    public setNext(
        next: PortCommandTaskBuilder<PortCommandTaskPayload>
    ): PortCommandTaskBuilder<PortCommandTaskPayload> {
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
