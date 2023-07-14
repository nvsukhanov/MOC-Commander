import { ITaskBuilder } from '../i-task-builder';
import { ControlSchemeBinding, PortCommandTask, PortCommandTaskPayload } from '../../../models';
import { payloadHash } from '../payload-hash';

export abstract class BaseTaskBuilder<TPayload extends PortCommandTaskPayload> implements ITaskBuilder {
    private next?: BaseTaskBuilder<PortCommandTaskPayload>;

    protected abstract buildPayload(
        binding: ControlSchemeBinding,
        inputValue: number,
        motorEncoderOffset: number,
        previousTaskPayload: PortCommandTask | null
    ): TPayload | null;

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
        next: BaseTaskBuilder<PortCommandTaskPayload>
    ): BaseTaskBuilder<PortCommandTaskPayload> {
        this.next = next;
        return next;
    }

    private calculateHash(
        binding: ControlSchemeBinding,
        payload: TPayload
    ): string {
        return `${binding.output.hubId}/${binding.output.portId}/${payloadHash(payload)}`;
    }
}
