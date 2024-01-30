import { Dictionary } from '@ngrx/entity';
import { Injectable } from '@angular/core';
import { ControlSchemeBindingType } from '@app/shared-misc';
import {
    AttachedIoPropsModel,
    ControlSchemeInputAction,
    ControlSchemeSetAngleBinding,
    ControllerInputModel,
    PortCommandTask,
    PortCommandTaskPayload,
    SetAngleTaskPayload,
    controllerInputIdFn
} from '@app/store';

import { ITaskPayloadBuilder } from '../i-task-payload-factory';

@Injectable()
export class SetAngleTaskPayloadBuilderService implements ITaskPayloadBuilder<ControlSchemeBindingType.SetAngle> {
    public buildPayload(
        binding: ControlSchemeSetAngleBinding,
        inputsState: Dictionary<ControllerInputModel>,
        ioProps: Omit<AttachedIoPropsModel, 'hubId' | 'portId'> | null,
    ): { payload: SetAngleTaskPayload; inputTimestamp: number } | null {
        const setAngleInput = inputsState[controllerInputIdFn(binding.inputs[ControlSchemeInputAction.SetAngle])];

        if (!setAngleInput?.isActivated) {
            return null;
        }
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

        return { payload, inputTimestamp: setAngleInput?.timestamp ?? Date.now() };
    }

    public buildCleanupPayload(
        previousTask: PortCommandTask
    ): PortCommandTaskPayload | null {
        if (previousTask.payload.bindingType !== ControlSchemeBindingType.SetAngle) {
            return null;
        }
        return {
            bindingType: ControlSchemeBindingType.SetSpeed,
            speed: 0,
            power: 0,
            brakeFactor: 0,
            useAccelerationProfile: previousTask.payload.useAccelerationProfile,
            useDecelerationProfile: previousTask.payload.useDecelerationProfile
        };
    }
}
