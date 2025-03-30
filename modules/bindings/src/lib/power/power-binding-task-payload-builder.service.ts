import { Injectable } from '@angular/core';
import { ControlSchemeBindingType, clampSpeed } from '@app/shared-misc';
import {
  ControlSchemePowerBinding,
  InputDirection,
  PortCommandTask,
  PortCommandTaskPayload,
  PowerBindingInputAction,
  PowerTaskPayload,
  TaskInputs,
  TaskType,
} from '@app/store';

import { extractDirectionAwareInputValue, snapSpeed } from '../common';
import { ITaskPayloadBuilder } from '../i-task-payload-factory';

@Injectable()
export class PowerBindingTaskPayloadBuilderService implements ITaskPayloadBuilder<ControlSchemeBindingType.Power> {
  public buildPayload(
    binding: ControlSchemePowerBinding,
    currentInput: TaskInputs<ControlSchemeBindingType.Power>,
  ): { payload: PowerTaskPayload; inputTimestamp: number } | null {
    const forwardsInputModel = currentInput[PowerBindingInputAction.Forwards];
    const backwardsInputModel = currentInput[PowerBindingInputAction.Backwards];

    let inputTimestamp = 0;
    if (forwardsInputModel || backwardsInputModel) {
      inputTimestamp = Math.max(forwardsInputModel?.timestamp ?? 0, backwardsInputModel?.timestamp ?? 0);
    } else {
      return null;
    }

    const forwardsInputValue = forwardsInputModel?.value ?? 0;
    const forwardsInputDirection =
      binding.inputs[PowerBindingInputAction.Forwards]?.inputDirection ?? InputDirection.Positive;

    const backwardsInputValue = backwardsInputModel?.value ?? 0;
    const backwardsInputDirection =
      binding.inputs[PowerBindingInputAction.Backwards]?.inputDirection ?? InputDirection.Positive;

    const forwardsInput = extractDirectionAwareInputValue(forwardsInputValue, forwardsInputDirection);
    const backwardsInput = extractDirectionAwareInputValue(backwardsInputValue, backwardsInputDirection);

    const forwardsPower = Math.abs(forwardsInput) * binding.maxPower * (binding.invert ? -1 : 1);
    const backwardsPower = Math.abs(backwardsInput) * binding.maxPower * (binding.invert ? -1 : 1);

    const payload: PowerTaskPayload = {
      type: TaskType.Power,
      power: snapSpeed(clampSpeed(forwardsPower - backwardsPower)),
      modeId: binding.modeId,
    };

    return { payload, inputTimestamp };
  }

  public buildCleanupPayload(previousTask: PortCommandTask): PortCommandTaskPayload | null {
    if (previousTask.payload.type !== TaskType.Power) {
      return null;
    }
    return {
      type: TaskType.Power,
      power: 0,
      modeId: previousTask.payload.modeId,
    };
  }
}
