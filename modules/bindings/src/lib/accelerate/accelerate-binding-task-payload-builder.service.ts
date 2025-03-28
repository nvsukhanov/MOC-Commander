import { Injectable } from '@angular/core';
import { ControlSchemeBindingType, clampSpeed } from '@app/shared-misc';
import {
  AccelerateBindingInputAction,
  AttachedIoPropsModel,
  ControlSchemeAccelerateBinding,
  PortCommandTask,
  PortCommandTaskPayload,
  SpeedTaskPayload,
  TaskInputs,
  TaskType,
} from '@app/store';

import { isTriggeredInputActivated, snapSpeed } from '../common';
import { ITaskPayloadBuilder } from '../i-task-payload-factory';

@Injectable()
export class AccelerateBindingTaskPayloadBuilderService implements ITaskPayloadBuilder<ControlSchemeBindingType.Accelerate> {
  public buildPayload(
    binding: ControlSchemeAccelerateBinding,
    currentInput: TaskInputs<ControlSchemeBindingType.Speed>,
    previousInput: TaskInputs<ControlSchemeBindingType.Speed>,
    ioProps: Omit<AttachedIoPropsModel, 'hubId' | 'portId'> | null,
    previousTask: PortCommandTask | null,
  ): { payload: SpeedTaskPayload; inputTimestamp: number } | null {
    const forwardsInput = this.getActiveInput(binding, currentInput, previousInput, AccelerateBindingInputAction.Forwards);
    const backwardsInput = this.getActiveInput(binding, currentInput, previousInput, AccelerateBindingInputAction.Backwards);
    const brakeInput = this.getActiveInput(binding, currentInput, previousInput, AccelerateBindingInputAction.Decelerate);

    const previousSpeed = previousTask?.payload.type === TaskType.Speed ? previousTask.payload.speed : 0;

    if (forwardsInput.isActivated) {
      const forwardsIncrement = binding.invert ? -binding.forwardsSpeedIncrement : binding.forwardsSpeedIncrement;
      const nextSpeed = snapSpeed(clampSpeed(previousSpeed + forwardsIncrement));

      return {
        payload: this.buildTaskPayload(nextSpeed, binding, previousTask),
        inputTimestamp: forwardsInput.timestamp,
      };
    }

    if (backwardsInput.isActivated) {
      const backwardsIncrement = binding.invert ? -binding.backwardsSpeedIncrement : binding.backwardsSpeedIncrement;
      const nextSpeed = snapSpeed(clampSpeed(previousSpeed - backwardsIncrement));

      return {
        payload: this.buildTaskPayload(nextSpeed, binding, previousTask),
        inputTimestamp: backwardsInput.timestamp,
      };
    }

    if (brakeInput.isActivated) {
      const previousBrakeFactor = previousTask?.payload.type === TaskType.Speed ? previousTask.payload.brakeFactor : 0;

      if (Math.abs(previousSpeed) - previousBrakeFactor <= binding.decelerateSpeedDecrement) {
        const payload = {
          type: TaskType.Speed,
          speed: 0,
          brakeFactor: previousBrakeFactor,
          power: 0,
          useAccelerationProfile: false,
          useDecelerationProfile: false,
        } satisfies SpeedTaskPayload;

        return { payload, inputTimestamp: brakeInput.timestamp };
      }
      if (previousSpeed !== 0 && previousBrakeFactor !== previousSpeed) {
        const nextSpeed = previousSpeed - Math.sign(previousSpeed) * binding.decelerateSpeedDecrement;

        return {
          payload: this.buildTaskPayload(nextSpeed, binding, previousTask),
          inputTimestamp: brakeInput.timestamp,
        };
      }
    }

    return null;
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

  private getActiveInput(
    binding: ControlSchemeAccelerateBinding,
    currentInput: TaskInputs<ControlSchemeBindingType.Accelerate>,
    previousInput: TaskInputs<ControlSchemeBindingType.Accelerate>,
    inputAction: keyof ControlSchemeAccelerateBinding['inputs'],
  ): { isActivated: boolean; timestamp: number } {
    const inputConfig = binding.inputs[inputAction];
    if (!inputConfig) {
      return {
        isActivated: false,
        timestamp: -Infinity,
      };
    }
    const isActivated = isTriggeredInputActivated(inputConfig.inputDirection, inputAction, currentInput, previousInput);
    const timestamp = isActivated ? currentInput[inputAction]?.timestamp : undefined;
    return {
      isActivated,
      timestamp: timestamp ?? -Infinity,
    };
  }

  private buildTaskPayload(nextSpeed: number, binding: ControlSchemeAccelerateBinding, previousTask: PortCommandTask | null): SpeedTaskPayload {
    const speed = Math.abs(nextSpeed) > binding.maxSpeed ? binding.maxSpeed * Math.sign(nextSpeed) : nextSpeed;
    const previousBrakeFactor = previousTask?.payload.type === TaskType.Speed ? previousTask.payload.brakeFactor : 0;

    return {
      type: TaskType.Speed,
      speed,
      brakeFactor: previousBrakeFactor,
      power: binding.power,
      useAccelerationProfile: false,
      useDecelerationProfile: false,
    };
  }
}
