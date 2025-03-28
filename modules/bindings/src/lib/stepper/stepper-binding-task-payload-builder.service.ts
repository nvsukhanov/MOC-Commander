import { Injectable } from '@angular/core';
import { ControlSchemeBindingType } from '@app/shared-misc';
import {
  ControlSchemeStepperBinding,
  PortCommandTask,
  PortCommandTaskPayload,
  StepperBindingInputAction,
  StepperTaskPayload,
  TaskInput,
  TaskInputs,
  TaskType,
} from '@app/store';

import { ITaskPayloadBuilder } from '../i-task-payload-factory';
import { isDirectionalInputActivated } from '../common';

@Injectable()
export class StepperBindingTaskPayloadBuilderService implements ITaskPayloadBuilder<ControlSchemeBindingType.Stepper> {
  public buildPayload(
    binding: ControlSchemeStepperBinding,
    currentInput: TaskInputs<ControlSchemeBindingType.Stepper>,
    previousInput: TaskInputs<ControlSchemeBindingType.Stepper>,
  ): { payload: StepperTaskPayload; inputTimestamp: number } | null {
    const activeInputData = this.getActivatedInput(binding, currentInput, previousInput);
    if (!activeInputData) {
      return null;
    }
    const payload: StepperTaskPayload = {
      type: TaskType.Stepper,
      degree: binding.degree,
      speed: binding.speed,
      power: binding.power,
      endState: binding.endState,
      useAccelerationProfile: binding.useAccelerationProfile,
      useDecelerationProfile: binding.useDecelerationProfile,
      action: activeInputData.action,
    };

    return { payload, inputTimestamp: activeInputData.input.timestamp };
  }

  public buildCleanupPayload(previousTask: PortCommandTask): PortCommandTaskPayload | null {
    if (previousTask.payload.type !== TaskType.Stepper) {
      return null;
    }
    return {
      type: TaskType.Speed,
      speed: 0,
      power: 0,
      brakeFactor: 0,
      useAccelerationProfile: previousTask.payload.useAccelerationProfile,
      useDecelerationProfile: previousTask.payload.useDecelerationProfile,
    };
  }

  private getActivatedInput(
    binding: ControlSchemeStepperBinding,
    currentInput: TaskInputs<ControlSchemeBindingType.Stepper>,
    previousInput: TaskInputs<ControlSchemeBindingType.Stepper>,
  ): { input: TaskInput; action: StepperBindingInputAction } | null {
    const currentCwInput = this.isActivated(binding, currentInput, StepperBindingInputAction.Cw);
    const currentCcwInput = this.isActivated(binding, currentInput, StepperBindingInputAction.Ccw);
    const previousCwInput = this.isActivated(binding, previousInput, StepperBindingInputAction.Cw);
    const previousCcwInput = this.isActivated(binding, previousInput, StepperBindingInputAction.Ccw);

    const cwTriggered = currentCwInput?.isActivated && !previousCwInput?.isActivated;
    const ccwTriggered = currentCcwInput?.isActivated && !previousCcwInput?.isActivated;

    if (!cwTriggered && !ccwTriggered) {
      return null;
    } else if (cwTriggered && ccwTriggered) {
      if (currentCwInput.input.timestamp > currentCcwInput.input.timestamp) {
        return { input: currentCwInput.input, action: StepperBindingInputAction.Cw };
      } else {
        return { input: currentCcwInput.input, action: StepperBindingInputAction.Ccw };
      }
    } else if (cwTriggered) {
      return { input: currentCwInput.input, action: StepperBindingInputAction.Cw };
    } else if (ccwTriggered) {
      return { input: currentCcwInput.input, action: StepperBindingInputAction.Ccw };
    }

    return null;
  }

  private isActivated(
    binding: ControlSchemeStepperBinding,
    currentInput: TaskInputs<ControlSchemeBindingType.Stepper>,
    action: StepperBindingInputAction,
  ): { isActivated: boolean; input: TaskInput } | null {
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
