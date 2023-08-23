import { Dictionary } from '@ngrx/entity';
import { ControlSchemeBindingType } from '@app/shared';
import { controllerInputIdFn } from '@app/store';

import { BaseTaskBuilder } from './base-task-builder';
import { ControlSchemeBinding, ControllerInputModel, PortCommandTask, PortCommandTaskPayload, PortCommandTaskType, SetAngleTaskPayload } from '../../../models';

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
            taskType: PortCommandTaskType.SetAngle,
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
        if (previousTask.payload.taskType !== PortCommandTaskType.SetAngle) {
            return null;
        }
        return {
            taskType: PortCommandTaskType.SetSpeed,
            speed: 0,
            power: 0,
            activeInput: false,
            useAccelerationProfile: previousTask.payload.useAccelerationProfile,
            useDecelerationProfile: previousTask.payload.useDecelerationProfile
        };
    }
}
