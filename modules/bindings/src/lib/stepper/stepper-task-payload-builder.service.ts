import { Dictionary } from '@ngrx/entity';
import { Injectable } from '@angular/core';
import { ControlSchemeBindingType } from '@app/shared-misc';
import {
    ControlSchemeInputAction,
    ControlSchemeStepperBinding,
    ControllerInputModel,
    PortCommandTask,
    PortCommandTaskPayload,
    StepperTaskPayload,
    controllerInputIdFn
} from '@app/store';

import { ITaskPayloadBuilder } from '../i-task-payload-factory';

@Injectable()
export class StepperTaskPayloadBuilderService implements ITaskPayloadBuilder<ControlSchemeBindingType.Stepper> {
    public buildPayload(
        binding: ControlSchemeStepperBinding,
        inputsState: Dictionary<ControllerInputModel>,
    ): { payload: StepperTaskPayload; inputTimestamp: number } | null {
        const stepInput = inputsState[controllerInputIdFn(binding.inputs[ControlSchemeInputAction.Step])];

        if (!stepInput?.isActivated) {
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
