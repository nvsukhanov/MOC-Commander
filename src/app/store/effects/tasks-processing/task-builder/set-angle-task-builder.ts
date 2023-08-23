import { Dictionary } from '@ngrx/entity';
import { ControlSchemeBindingType } from '@app/shared';

import { controllerInputIdFn } from '../../../reducers';
import { BaseTaskBuilder } from './base-task-builder';
import { ControlSchemeBinding, ControllerInputModel, PortCommandTask, PortCommandTaskPayload, SetAngleTaskPayload } from '../../../models';

export class SetAngleTaskBuilder extends BaseTaskBuilder {
    private readonly inputValueThreshold = 0.5;

    protected buildPayload(
        binding: ControlSchemeBinding,
        inputsState: Dictionary<ControllerInputModel>,
    ): { payload: SetAngleTaskPayload; inputTimestamp: number } | null {
        if (binding.operationMode !== ControlSchemeBindingType.SetAngle) {
            return null;
        }

        const setAngleInput = inputsState[controllerInputIdFn(binding.inputs.setAngle)];
        const setAngleInputValue = setAngleInput?.value ?? 0;

        if (setAngleInputValue < this.inputValueThreshold) { // TODO: inject threshold
            return null;
        }
        const payload: SetAngleTaskPayload = {
            bindingType: ControlSchemeBindingType.SetAngle,
            angle: binding.angle,
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
