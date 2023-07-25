import { ITaskBuilder } from '../i-task-builder';
import { ControlSchemeBinding, PortCommandTask, PortCommandTaskPayload } from '../../../models';
import { payloadHash } from '../payload-hash';

export abstract class BaseTaskBuilder implements ITaskBuilder {
    private next?: BaseTaskBuilder;

    protected abstract buildPayload(
        binding: ControlSchemeBinding,
        inputValue: number,
        motorEncoderOffset: number,
        previousTaskPayload: PortCommandTask | null
    ): PortCommandTaskPayload | null;

    protected abstract buildCleanupPayload(
        previousTask: PortCommandTask
    ): PortCommandTaskPayload | null;

    public buildTask(
        binding: ControlSchemeBinding,
        inputValue: number,
        motorEncoderOffset: number,
        lastExecutedTask: PortCommandTask | null
    ): PortCommandTask | null {
        const payload = this.buildPayload(binding, inputValue, motorEncoderOffset, lastExecutedTask);
        if (payload) {
            return this.composeTask(binding, payload);
        }
        if (this.next) {
            return this.next.buildTask(binding, inputValue, motorEncoderOffset, lastExecutedTask);
        }
        return null;
    }

    public buildCleanupTask(
        previousTask: PortCommandTask
    ): PortCommandTask | null {
        const payload = this.buildCleanupPayload(previousTask);
        if (payload) {
            return {
                ...previousTask,
                payload,
                hash: this.calculateHash(previousTask.hubId, previousTask.portId, payload)
            };
        }
        if (this.next) {
            return this.next.buildCleanupTask(previousTask);
        }
        return null;
    }

    public setNext(
        next: BaseTaskBuilder
    ): BaseTaskBuilder {
        this.next = next;
        return next;
    }

    private calculateHash(
        hubId: string,
        portId: number,
        payload: PortCommandTaskPayload
    ): string {
        return `${hubId}/${portId}/${payloadHash(payload)}`;
    }

    private composeTask(
        binding: ControlSchemeBinding,
        payload: PortCommandTaskPayload
    ): PortCommandTask {
        return {
            hubId: binding.hubId,
            portId: binding.portId,
            bindingId: binding.id,
            payload,
            hash: this.calculateHash(binding.hubId, binding.portId, payload)
        };
    }
}
