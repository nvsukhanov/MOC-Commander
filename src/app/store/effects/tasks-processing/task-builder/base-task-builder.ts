import { Dictionary } from '@ngrx/entity';

import { ITaskBuilder } from '../i-task-builder';
import { ControlSchemeBinding, ControllerInputModel, PortCommandTask, PortCommandTaskPayload } from '../../../models';
import { payloadHash } from '../payload-hash';

export abstract class BaseTaskBuilder implements ITaskBuilder {
    private next?: BaseTaskBuilder;

    protected abstract buildPayload(
        binding: ControlSchemeBinding,
        inputsState: Dictionary<ControllerInputModel>,
        motorEncoderOffset: number,
        previousTaskPayload: PortCommandTask | null
    ): { payload: PortCommandTaskPayload; inputTimestamp: number } | null;

    protected abstract buildCleanupPayload(
        previousTask: PortCommandTask
    ): PortCommandTaskPayload | null;

    public buildTask(
        binding: ControlSchemeBinding,
        inputsState: Dictionary<ControllerInputModel>,
        motorEncoderOffset: number,
        lastExecutedTask: PortCommandTask | null
    ): PortCommandTask | null {
        const payloadBuildResult = this.buildPayload(binding, inputsState, motorEncoderOffset, lastExecutedTask);
        if (payloadBuildResult) {
            return this.composeTask(binding, payloadBuildResult.payload, payloadBuildResult.inputTimestamp);
        }
        if (this.next) {
            return this.next.buildTask(binding, inputsState, motorEncoderOffset, lastExecutedTask);
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
        payload: PortCommandTaskPayload,
        inputTimestamp: number
    ): PortCommandTask {
        return {
            hubId: binding.hubId,
            portId: binding.portId,
            bindingId: binding.id,
            payload,
            hash: this.calculateHash(binding.hubId, binding.portId, payload),
            inputTimestamp
        };
    }
}
