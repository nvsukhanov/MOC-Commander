import { Injectable } from '@angular/core';
import { ControlSchemeBindingType } from '@app/shared-misc';
import { ControlSchemeStepperBinding, ControllerInputModel, PortCommandTask, PortCommandTaskPayload, StepperInputAction, StepperTaskPayload } from '@app/store';

import { ITaskPayloadBuilder } from '../i-task-payload-factory';
import { BindingInputExtractionResult } from '../i-binding-task-input-extractor';
import { isDirectionalInputActivated } from '../common';

@Injectable()
export class StepperTaskPayloadBuilderService implements ITaskPayloadBuilder<ControlSchemeBindingType.Stepper> {
    public buildPayload(
        binding: ControlSchemeStepperBinding,
        currentInput: BindingInputExtractionResult<ControlSchemeBindingType.Stepper>,
        previousInput: BindingInputExtractionResult<ControlSchemeBindingType.Stepper>,
    ): { payload: StepperTaskPayload; inputTimestamp: number } | null {
        const activeInputData = this.getActivatedInput(binding, currentInput, previousInput);
        if (!activeInputData) {
            return null;
        }
        const payload: StepperTaskPayload = {
            bindingType: ControlSchemeBindingType.Stepper,
            degree: binding.degree,
            speed: binding.speed,
            power: binding.power,
            endState: binding.endState,
            useAccelerationProfile: binding.useAccelerationProfile,
            useDecelerationProfile: binding.useDecelerationProfile,
            action: activeInputData.action
        };

        return { payload, inputTimestamp: activeInputData.input.timestamp };
    }

    public buildCleanupPayload(
        previousTask: PortCommandTask
    ): PortCommandTaskPayload | null {
        if (previousTask.payload.bindingType !== ControlSchemeBindingType.Stepper) {
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

    private getActivatedInput(
        binding: ControlSchemeStepperBinding,
        currentInput: BindingInputExtractionResult<ControlSchemeBindingType.Stepper>,
        previousInput: BindingInputExtractionResult<ControlSchemeBindingType.Stepper>
    ): { input: ControllerInputModel; action: StepperInputAction } | null {
        const currentCwInput = this.isActivated(binding, currentInput, StepperInputAction.Cw);
        const currentCcwInput = this.isActivated(binding, currentInput, StepperInputAction.Ccw);
        const previousCwInput = this.isActivated(binding, previousInput, StepperInputAction.Cw);
        const previousCcwInput = this.isActivated(binding, previousInput, StepperInputAction.Ccw);

        const cwTriggered = currentCwInput?.isActivated && !previousCwInput?.isActivated;
        const ccwTriggered = currentCcwInput?.isActivated && !previousCcwInput?.isActivated;

        if (!cwTriggered && !ccwTriggered) {
            return null;
        } else if (cwTriggered && ccwTriggered) {
            if (currentCwInput.input.timestamp > currentCcwInput.input.timestamp) {
                return { input: currentCwInput.input, action: StepperInputAction.Cw };
            } else {
                return { input: currentCcwInput.input, action: StepperInputAction.Ccw };
            }
        } else if (cwTriggered) {
            return { input: currentCwInput.input, action: StepperInputAction.Cw };
        } else if (ccwTriggered) {
            return { input: currentCcwInput.input, action: StepperInputAction.Ccw };
        }

        return null;
    }

    private isActivated(
        binding: ControlSchemeStepperBinding,
        currentInput: BindingInputExtractionResult<ControlSchemeBindingType.Stepper>,
        action: StepperInputAction
    ): { isActivated: boolean; input: ControllerInputModel } | null {
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
