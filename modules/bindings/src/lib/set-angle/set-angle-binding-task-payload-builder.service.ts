import { Injectable } from '@angular/core';
import { ControlSchemeBindingType } from '@app/shared-misc';
import {
    AttachedIoPropsModel,
    ControlSchemeSetAngleBinding,
    PortCommandTask,
    PortCommandTaskPayload,
    SetAngleBindingInputAction,
    SetAngleTaskPayload,
    TaskInput,
    TaskInputs,
    TaskType
} from '@app/store';

import { ITaskPayloadBuilder } from '../i-task-payload-factory';
import { isDirectionalInputActivated } from '../common';

@Injectable()
export class SetAngleBindingTaskPayloadBuilderService implements ITaskPayloadBuilder<ControlSchemeBindingType.SetAngle> {
    public buildPayload(
        binding: ControlSchemeSetAngleBinding,
        currentInput: TaskInputs<ControlSchemeBindingType.SetAngle>,
        previousInput: TaskInputs<ControlSchemeBindingType.SetAngle>,
        ioProps: Omit<AttachedIoPropsModel, 'hubId' | 'portId'> | null,
    ): { payload: SetAngleTaskPayload; inputTimestamp: number } | null {
        const currentSetAngleInput = this.isActivated(binding, currentInput, SetAngleBindingInputAction.SetAngle);
        const previousSetAngleInput = this.isActivated(binding, previousInput, SetAngleBindingInputAction.SetAngle);

        if (currentSetAngleInput?.isActivated && !previousSetAngleInput?.isActivated) {
            const resultingAngle = binding.angle - (ioProps?.motorEncoderOffset ?? 0);

            const payload: SetAngleTaskPayload = {
                type: TaskType.SetAngle,
                angle: resultingAngle,
                speed: binding.speed,
                power: binding.power,
                endState: binding.endState,
                useAccelerationProfile: binding.useAccelerationProfile,
                useDecelerationProfile: binding.useDecelerationProfile
            };

            return { payload, inputTimestamp: currentInput[SetAngleBindingInputAction.SetAngle]?.timestamp ?? 0 };
        }

        return null;
    }

    public buildCleanupPayload(
        previousTask: PortCommandTask
    ): PortCommandTaskPayload | null {
        if (previousTask.payload.type !== TaskType.SetAngle) {
            return null;
        }
        return {
            type: TaskType.Speed,
            speed: 0,
            power: 0,
            brakeFactor: 0,
            useAccelerationProfile: previousTask.payload.useAccelerationProfile,
            useDecelerationProfile: previousTask.payload.useDecelerationProfile
        };
    }

    // TODO: same pattern as in StepperBindingTaskPayloadBuilderService. Refactor to avoid duplication
    private isActivated(
        binding: ControlSchemeSetAngleBinding,
        currentInput: TaskInputs<ControlSchemeBindingType.SetAngle>,
        action: SetAngleBindingInputAction
    ): { isActivated: boolean; input: TaskInput } | null {
        const inputConfigModel = binding.inputs[action];
        if (!inputConfigModel) {
            return null;
        }
        const input = currentInput[action];
        if (!input) {
            return null;
        }
        const isActivated = isDirectionalInputActivated(inputConfigModel.inputDirection, action, currentInput);
        return { isActivated, input };
    }
}
