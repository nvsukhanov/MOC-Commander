import { Injectable } from '@angular/core';
import { ControlSchemeBindingType, clampSpeed } from '@app/shared-misc';
import {
  ControlSchemeSpeedBinding,
  InputDirection,
  PortCommandTask,
  PortCommandTaskPayload,
  SpeedBindingInputAction,
  SpeedTaskPayload,
  TaskInputs,
  TaskType,
} from '@app/store';

import { extractDirectionAwareInputValue, snapSpeed } from '../common';
import { ITaskPayloadBuilder } from '../i-task-payload-factory';

@Injectable()
export class SpeedBindingTaskPayloadBuilderService implements ITaskPayloadBuilder<ControlSchemeBindingType.Speed> {
  public buildPayload(
    binding: ControlSchemeSpeedBinding,
    currentInput: TaskInputs<ControlSchemeBindingType.Speed>,
  ): { payload: SpeedTaskPayload; inputTimestamp: number } | null {
    const forwardsInputModel = currentInput[SpeedBindingInputAction.Forwards];
    const backwardsInputModel = currentInput[SpeedBindingInputAction.Backwards];
    const brakeInputModel = currentInput[SpeedBindingInputAction.Brake];

    let inputTimestamp = 0;
    if (forwardsInputModel || brakeInputModel || backwardsInputModel) {
      inputTimestamp = Math.max(
        forwardsInputModel?.timestamp ?? 0,
        backwardsInputModel?.timestamp ?? 0,
        brakeInputModel?.timestamp ?? 0,
      );
    } else {
      return null;
    }

    const forwardsInputValue = forwardsInputModel?.value ?? 0;
    const forwardsInputDirection =
      binding.inputs[SpeedBindingInputAction.Forwards]?.inputDirection ?? InputDirection.Positive;

    const backwardsInputValue = backwardsInputModel?.value ?? 0;
    const backwardsInputDirection =
      binding.inputs[SpeedBindingInputAction.Backwards]?.inputDirection ?? InputDirection.Positive;

    const brakeInputValue = brakeInputModel?.value ?? 0;
    const brakeInputDirection =
      binding.inputs[SpeedBindingInputAction.Brake]?.inputDirection ?? InputDirection.Positive;

    const forwardsInput = extractDirectionAwareInputValue(forwardsInputValue, forwardsInputDirection);
    const backwardsInput = extractDirectionAwareInputValue(backwardsInputValue, backwardsInputDirection);
    const brakeInput = extractDirectionAwareInputValue(brakeInputValue, brakeInputDirection);

    const forwardsSpeed = Math.abs(forwardsInput) * binding.maxSpeed * (binding.invert ? -1 : 1);
    const backwardsSpeed = Math.abs(backwardsInput) * binding.maxSpeed * (binding.invert ? -1 : 1);

    const payload: SpeedTaskPayload = {
      type: TaskType.Speed,
      speed: snapSpeed(clampSpeed(forwardsSpeed - backwardsSpeed)),
      brakeFactor: Math.round(Math.abs(brakeInput) * binding.maxSpeed),
      power: binding.power,
      useAccelerationProfile: binding.useAccelerationProfile,
      useDecelerationProfile: binding.useDecelerationProfile,
    };

    return { payload, inputTimestamp };
  }

  public buildCleanupPayload(previousTask: PortCommandTask): PortCommandTaskPayload | null {
    if (previousTask.payload.type !== TaskType.Speed) {
      return null;
    }
    return {
      type: TaskType.Speed,
      speed: 0,
      brakeFactor: 0,
      power: 0,
      useAccelerationProfile: previousTask.payload.useAccelerationProfile,
      useDecelerationProfile: previousTask.payload.useDecelerationProfile,
    };
  }
}
