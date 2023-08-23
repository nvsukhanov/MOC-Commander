import { Dictionary } from '@ngrx/entity';
import { ControlSchemeBindingType } from '@app/shared';

import { ControlSchemeBinding, ControllerInputModel, PortCommandTask, PortCommandTaskPayload, StepperTaskPayload } from '../../../models';
import { controllerInputIdFn } from '../../../reducers';
import { BaseTaskBuilder } from './base-task-builder';

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
            bindingType: ControlSchemeBindingType.Stepper,
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
        if (previousTask.payload.bindingType !== ControlSchemeBindingType.Stepper) {
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
