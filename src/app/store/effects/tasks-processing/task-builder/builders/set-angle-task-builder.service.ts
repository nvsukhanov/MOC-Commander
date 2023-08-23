import { Dictionary } from '@ngrx/entity';
import { Injectable } from '@angular/core';
import { ControlSchemeBindingType } from '@app/shared';

import { controllerInputIdFn } from '../../../../reducers';
import { BaseTaskBuilder } from '../base-task-builder';
import { ControlSchemeSetAngleBinding, ControllerInputModel, PortCommandTask, PortCommandTaskPayload, SetAngleTaskPayload } from '../../../../models';

@Injectable({ providedIn: 'root' })
export class SetAngleTaskBuilderService extends BaseTaskBuilder<ControlSchemeSetAngleBinding, SetAngleTaskPayload> {
    private readonly inputValueThreshold = 0.5;

    protected buildPayload(
        binding: ControlSchemeSetAngleBinding,
        inputsState: Dictionary<ControllerInputModel>,
        motorEncoderOffset: number,
    ): { payload: SetAngleTaskPayload; inputTimestamp: number } | null {
        const setAngleInput = inputsState[controllerInputIdFn(binding.inputs.setAngle)];
        const setAngleInputValue = setAngleInput?.value ?? 0;

        if (setAngleInputValue < this.inputValueThreshold) { // TODO: inject threshold
            return null;
        }
        const resultingAngle = binding.angle - motorEncoderOffset;

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

    protected buildCleanupPayload(
        previousTask: PortCommandTask
    ): PortCommandTaskPayload | null {
        if (previousTask.payload.bindingType !== ControlSchemeBindingType.SetAngle) {
            return null;
        }
        return {
            bindingType: ControlSchemeBindingType.Linear,
            speed: 0,
            power: 0,
            activeInput: false,
            useAccelerationProfile: previousTask.payload.useAccelerationProfile,
            useDecelerationProfile: previousTask.payload.useDecelerationProfile
        };
    }
}
