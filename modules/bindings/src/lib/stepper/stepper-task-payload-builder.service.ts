import { Injectable } from '@angular/core';
import { ControlSchemeBindingType } from '@app/shared-misc';
import { ControlSchemeInputAction, ControlSchemeStepperBinding, PortCommandTask, PortCommandTaskPayload, StepperTaskPayload } from '@app/store';

import { ITaskPayloadBuilder } from '../i-task-payload-factory';
import { BindingInputExtractionResult } from '../i-binding-task-input-extractor';

@Injectable()
export class StepperTaskPayloadBuilderService implements ITaskPayloadBuilder<ControlSchemeBindingType.Stepper> {
    public buildPayload(
        binding: ControlSchemeStepperBinding,
        currentInput: BindingInputExtractionResult<ControlSchemeBindingType.Stepper>,
        previousInput: BindingInputExtractionResult<ControlSchemeBindingType.Stepper>,
    ): { payload: StepperTaskPayload; inputTimestamp: number } | null {
        const currentStepInput = currentInput[ControlSchemeInputAction.Step];
        const previousStepInput = previousInput[ControlSchemeInputAction.Step];

        if (currentStepInput?.isActivated && !previousStepInput?.isActivated) {
            const direction = Math.sign(currentStepInput.value);
            const payload: StepperTaskPayload = {
                bindingType: ControlSchemeBindingType.Stepper,
                degree: binding.degree * direction,
                speed: binding.speed,
                power: binding.power,
                endState: binding.endState,
                useAccelerationProfile: binding.useAccelerationProfile,
                useDecelerationProfile: binding.useDecelerationProfile
            };

            return { payload, inputTimestamp: currentStepInput?.timestamp ?? Date.now() };
        }
        return null;
    }

    public buildCleanupPayload(
        previousTask: PortCommandTask
    ): PortCommandTaskPayload | null {
        if (previousTask.payload.bindingType !== ControlSchemeBindingType.Stepper) {
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
