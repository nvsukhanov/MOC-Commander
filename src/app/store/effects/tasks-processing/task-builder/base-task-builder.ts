import { Dictionary } from '@ngrx/entity';

import { ITaskBuilder } from './i-task-builder';
import { ControlSchemeBinding, ControllerInputModel, PortCommandTask, PortCommandTaskPayload } from '../../../models';
import { payloadHash } from '../payload-hash';

export abstract class BaseTaskBuilder<TBinding extends ControlSchemeBinding, TPayload extends PortCommandTaskPayload> implements ITaskBuilder {
    protected abstract buildPayload(
        binding: TBinding,
        inputsState: Dictionary<ControllerInputModel>,
        motorEncoderOffset: number,
        previousTaskPayload: PortCommandTask | null
    ): { payload: TPayload; inputTimestamp: number } | null;

    protected abstract buildCleanupPayload(
        previousTask: PortCommandTask
    ): PortCommandTaskPayload | null;

    public buildTask(
        binding: TBinding,
        inputsState: Dictionary<ControllerInputModel>,
        motorEncoderOffset: number,
        lastExecutedTask: PortCommandTask | null
    ): PortCommandTask & { payload: TPayload } | null {
        const payloadBuildResult = this.buildPayload(binding, inputsState, motorEncoderOffset, lastExecutedTask);
        if (payloadBuildResult) {
            return this.composeTask(binding, payloadBuildResult.payload, payloadBuildResult.inputTimestamp);
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
        return null;
    }

    private calculateHash(
        hubId: string,
        portId: number,
        payload: PortCommandTaskPayload
    ): string {
        return `${hubId}/${portId}/${payloadHash(payload)}`;
    }

    private composeTask(
        binding: TBinding,
        payload: TPayload,
        inputTimestamp: number
    ): PortCommandTask & { payload: TPayload } {
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
