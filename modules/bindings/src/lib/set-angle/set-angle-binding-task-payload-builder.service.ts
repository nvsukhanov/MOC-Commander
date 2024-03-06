import { Injectable } from '@angular/core';
import { ControlSchemeBindingType } from '@app/shared-misc';
import {
    AttachedIoPropsModel,
    ControlSchemeSetAngleBinding,
    PortCommandTask,
    PortCommandTaskPayload,
    SetAngleBindingInputAction,
    SetAngleTaskPayload
} from '@app/store';

import { ITaskPayloadBuilder } from '../i-task-payload-factory';
import { BindingInputExtractionResult } from '../i-binding-task-input-extractor';

@Injectable()
export class SetAngleBindingTaskPayloadBuilderService implements ITaskPayloadBuilder<ControlSchemeBindingType.SetAngle> {
    public buildPayload(
        binding: ControlSchemeSetAngleBinding,
        currentInput: BindingInputExtractionResult<ControlSchemeBindingType.SetAngle>,
        previousInput: BindingInputExtractionResult<ControlSchemeBindingType.SetAngle>,
        ioProps: Omit<AttachedIoPropsModel, 'hubId' | 'portId'> | null,
    ): { payload: SetAngleTaskPayload; inputTimestamp: number } | null {
        const currentSetAngleInput = currentInput[SetAngleBindingInputAction.SetAngle];
        const previousSetAngleInput = previousInput[SetAngleBindingInputAction.SetAngle];

        if (currentSetAngleInput?.isActivated && !previousSetAngleInput?.isActivated) {
            const resultingAngle = binding.angle - (ioProps?.motorEncoderOffset ?? 0);

            const payload: SetAngleTaskPayload = {
                bindingType: ControlSchemeBindingType.SetAngle,
                angle: resultingAngle,
                speed: binding.speed,
                power: binding.power,
                endState: binding.endState,
                useAccelerationProfile: binding.useAccelerationProfile,
                useDecelerationProfile: binding.useDecelerationProfile
            };

            return { payload, inputTimestamp: currentSetAngleInput.timestamp ?? Date.now() };
        }

        return null;
    }

    public buildCleanupPayload(
        previousTask: PortCommandTask
    ): PortCommandTaskPayload | null {
        if (previousTask.payload.bindingType !== ControlSchemeBindingType.SetAngle) {
            return null;
        }
        return {
            bindingType: ControlSchemeBindingType.Speed,
            speed: 0,
            power: 0,
            brakeFactor: 0,
            useAccelerationProfile: previousTask.payload.useAccelerationProfile,
            useDecelerationProfile: previousTask.payload.useDecelerationProfile
        };
    }
}
