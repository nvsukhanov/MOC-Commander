import { Dictionary } from '@ngrx/entity';
import { ControlSchemeBindingType } from '@app/shared';
import { controllerInputIdFn } from '@app/store';

import { BaseTaskBuilder } from './base-task-builder';
import { ControlSchemeBinding, ControllerInputModel, PortCommandTask, PortCommandTaskPayload, PortCommandTaskType, StepperTaskPayload } from '../../../models';

export class StepperTaskBuilder extends BaseTaskBuilder {
    protected buildPayload(
        binding: ControlSchemeBinding,
        inputsState: Dictionary<ControllerInputModel>,
    ): { payload: StepperTaskPayload; inputTimestamp: number } | null {
        if (binding.operationMode !== ControlSchemeBindingType.Stepper) {
            return null;
        }

        const stepInput = inputsState[controllerInputIdFn(binding.inputs.step)];
        const stepInputValue = stepInput?.value ?? 0;

        if (stepInputValue < 0.5) { // TODO: inject threshold
            return null;
        }

        const payload: StepperTaskPayload = {
            taskType: PortCommandTaskType.Stepper,
            degree: binding.degree,
            speed: binding.speed,
            power: binding.power,
            endState: binding.endState,
            useAccelerationProfile: binding.useAccelerationProfile,
            useDecelerationProfile: binding.useDecelerationProfile
        };

        return { payload, inputTimestamp: stepInput?.timestamp ?? Date.now() };
    }

    protected buildCleanupPayload(
        previousTask: PortCommandTask
    ): PortCommandTaskPayload | null {
        if (previousTask.payload.taskType !== PortCommandTaskType.Stepper) {
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
