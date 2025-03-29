import { Injectable } from '@angular/core';
import { ControlSchemeBindingType } from '@app/shared-misc';
import {
  AttachedIoPropsModel,
  ControlSchemeGearboxBinding,
  GearboxBindingInputAction,
  GearboxTaskPayload,
  PortCommandTask,
  PortCommandTaskPayload,
  TaskInputs,
  TaskType,
} from '@app/store';

import { calculateNextLoopingIndex, isTriggeredInputActivated } from '../common';
import { ITaskPayloadBuilder } from '../i-task-payload-factory';

@Injectable()
export class GearboxBindingTaskPayloadBuilderService implements ITaskPayloadBuilder<ControlSchemeBindingType.Gearbox> {
  public buildPayload(
    binding: ControlSchemeGearboxBinding,
    currentInput: TaskInputs<ControlSchemeBindingType.Gearbox>,
    previousInput: TaskInputs<ControlSchemeBindingType.Gearbox>,
    ioProps: Omit<AttachedIoPropsModel, 'hubId' | 'portId'> | null,
    previousTask: PortCommandTask | null,
  ): { payload: GearboxTaskPayload; inputTimestamp: number } | null {
    const gearboxPrevTask =
      previousTask && previousTask.payload.type === TaskType.Gearbox
        ? (previousTask as PortCommandTask<TaskType.Gearbox>)
        : null;
    return this.buildPayloadUsingPreviousTask(
      binding,
      currentInput,
      previousInput,
      ioProps?.motorEncoderOffset ?? 0,
      gearboxPrevTask,
    );
  }

  public buildCleanupPayload(previousTask: PortCommandTask): PortCommandTaskPayload | null {
    if (previousTask.payload.type !== TaskType.Gearbox) {
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

  private buildPayloadUsingPreviousTask(
    binding: ControlSchemeGearboxBinding,
    currentInput: TaskInputs<ControlSchemeBindingType.Gearbox>,
    previousInput: TaskInputs<ControlSchemeBindingType.Gearbox>,
    motorEncoderOffset: number,
    previousTask: PortCommandTask<TaskType.Gearbox> | null,
  ): { payload: GearboxTaskPayload; inputTimestamp: number } | null {
    const nextLevelInput = this.getActiveInput(
      binding,
      currentInput,
      previousInput,
      GearboxBindingInputAction.NextGear,
    );
    const prevLevelInput = this.getActiveInput(
      binding,
      currentInput,
      previousInput,
      GearboxBindingInputAction.PrevGear,
    );
    const resetLevelInput = this.getActiveInput(binding, currentInput, previousInput, GearboxBindingInputAction.Reset);

    if (!nextLevelInput.isActivated && !prevLevelInput.isActivated && !resetLevelInput.isActivated) {
      return null;
    }

    if (resetLevelInput.isActivated) {
      return {
        payload: this.buildResetPayload(binding, motorEncoderOffset),
        inputTimestamp: resetLevelInput.timestamp,
      };
    }

    const previousAngleIndexUnguarded = binding.angles.findIndex((angle) => angle === previousTask?.payload.angle);
    // TODO: we can probably find nearest angle instead of just using the initial step index
    const previousAngleIndex =
      previousAngleIndexUnguarded === -1 ? binding.initialLevelIndex : previousAngleIndexUnguarded;

    const angleChange = (+prevLevelInput.isActivated - +nextLevelInput.isActivated) as -1 | 1 | 0;

    const { nextIndex, isLooping } = calculateNextLoopingIndex(
      binding.angles,
      previousAngleIndex,
      angleChange,
      previousTask?.payload.isLooping ?? false,
      binding.loopingMode,
    );

    return {
      payload: {
        type: TaskType.Gearbox,
        initialLevelIndex: binding.initialLevelIndex,
        angleIndex: nextIndex,
        offset: motorEncoderOffset,
        angle: binding.angles[nextIndex],
        speed: binding.speed,
        power: binding.power,
        isLooping,
        useAccelerationProfile: binding.useAccelerationProfile,
        useDecelerationProfile: binding.useDecelerationProfile,
        endState: binding.endState,
      },
      inputTimestamp: Math.max(nextLevelInput.timestamp, prevLevelInput.timestamp),
    };
  }

  private buildResetPayload(binding: ControlSchemeGearboxBinding, motorEncoderOffset: number): GearboxTaskPayload {
    return {
      type: TaskType.Gearbox,
      initialLevelIndex: binding.initialLevelIndex,
      angleIndex: binding.initialLevelIndex,
      offset: motorEncoderOffset,
      angle: binding.angles[binding.initialLevelIndex],
      speed: binding.speed,
      power: binding.power,
      isLooping: false,
      useAccelerationProfile: binding.useAccelerationProfile,
      useDecelerationProfile: binding.useDecelerationProfile,
      endState: binding.endState,
    };
  }

  private getActiveInput(
    binding: ControlSchemeGearboxBinding,
    currentInput: TaskInputs<ControlSchemeBindingType.Gearbox>,
    previousInput: TaskInputs<ControlSchemeBindingType.Gearbox>,
    inputAction: keyof ControlSchemeGearboxBinding['inputs'],
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
}
