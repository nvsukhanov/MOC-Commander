import { MotorServoEndState } from 'rxpoweredup';
import { Injectable } from '@angular/core';
import { ControlSchemeBindingType, getTranslationArcs, transformRelativeDegToAbsoluteDeg } from '@app/shared-misc';
import {
  AttachedIoPropsModel,
  ControlSchemeServoBinding,
  InputDirection,
  PortCommandTask,
  PortCommandTaskPayload,
  ServoBindingInputAction,
  ServoTaskPayload,
  TaskInputs,
  TaskType,
} from '@app/store';

import { extractDirectionAwareInputValue } from '../common';
import { ITaskPayloadBuilder } from '../i-task-payload-factory';

@Injectable()
export class ServoBindingTaskPayloadBuilderService implements ITaskPayloadBuilder<ControlSchemeBindingType.Servo> {
  public buildPayload(
    binding: ControlSchemeServoBinding,
    currentInput: TaskInputs<ControlSchemeBindingType.Servo>,
    prevInput: TaskInputs<ControlSchemeBindingType.Servo>,
    ioProps: Omit<AttachedIoPropsModel, 'hubId' | 'portId'> | null,
    previousTaskPayload: PortCommandTask | null,
  ): { payload: ServoTaskPayload; inputTimestamp: number } | null {
    const cwInput = currentInput[ServoBindingInputAction.Cw];
    const ccwInput = currentInput[ServoBindingInputAction.Ccw];

    // If this is not the first task and there is no input - we do nothing
    if (!cwInput && !ccwInput && !!previousTaskPayload) {
      return null;
    }

    // without necessary data we can't do anything
    if (!ioProps?.startupMotorPositionData || ioProps.motorEncoderOffset === null) {
      // TODO: log an error
      return null;
    }

    const startingAbsolutePosition = transformRelativeDegToAbsoluteDeg(
      ioProps.startupMotorPositionData.position + ioProps.motorEncoderOffset,
    );

    const translationPaths = getTranslationArcs(startingAbsolutePosition, this.getAposCenter(binding, ioProps));

    const resultingCenterPosition =
      translationPaths.cw < translationPaths.ccw
        ? ioProps.startupMotorPositionData.position + translationPaths.cw
        : ioProps.startupMotorPositionData.position - translationPaths.ccw;

    if (!cwInput && !ccwInput) {
      // If there were no inputs and no previous task, we should center the servo
      return this.composeResult(
        resultingCenterPosition,
        binding.speed,
        binding.power,
        binding.useAccelerationProfile,
        binding.useDecelerationProfile,
        0,
      );
    }

    const cwInputDirection = binding.inputs[ServoBindingInputAction.Cw]?.inputDirection ?? InputDirection.Positive;
    const ccwInputDirection = binding.inputs[ServoBindingInputAction.Ccw]?.inputDirection ?? InputDirection.Positive;
    const cwValue = extractDirectionAwareInputValue(cwInput?.value ?? 0, cwInputDirection);
    const ccwValue = extractDirectionAwareInputValue(ccwInput?.value ?? 0, ccwInputDirection);

    const cumulativeInputValue = Math.abs(cwValue) - Math.abs(ccwValue);

    // TODO: create a function to clamp the value
    const clampedCumulativeInputValue = Math.max(-1, Math.min(1, cumulativeInputValue));

    // Math.max will never return 0 here because there is at least one input.
    // Null coalescing operator is used to avoid errors in case if any of the inputs being null
    const inputTimestamp = Math.max(cwInput?.timestamp ?? 0, ccwInput?.timestamp ?? 0);

    const servoRange = this.getServoRange(binding, ioProps);
    const rangePosition = (clampedCumulativeInputValue * servoRange) / 2;

    const targetAngle = rangePosition + resultingCenterPosition;

    return this.composeResult(
      targetAngle,
      binding.speed,
      binding.power,
      binding.useAccelerationProfile,
      binding.useDecelerationProfile,
      inputTimestamp,
    );
  }

  public buildCleanupPayload(previousTask: PortCommandTask): PortCommandTaskPayload | null {
    if (previousTask.payload.type !== TaskType.SetAngle) {
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

  private composeResult(
    angle: number,
    speed: number,
    power: number,
    useAccelerationProfile: boolean,
    useDecelerationProfile: boolean,
    inputTimestamp: number,
  ): { payload: ServoTaskPayload; inputTimestamp: number } {
    return {
      payload: {
        type: TaskType.SetAngle,
        angle: Math.round(angle),
        speed,
        power,
        endState: MotorServoEndState.hold,
        useAccelerationProfile,
        useDecelerationProfile,
      },
      inputTimestamp,
    };
  }

  private getServoRange(
    binding: ControlSchemeServoBinding,
    ioProps: Omit<AttachedIoPropsModel, 'hubId' | 'portId'> | null,
  ): number {
    if (binding.calibrateOnStart) {
      const range = ioProps?.startupServoCalibrationData?.range;
      if (range === undefined) {
        throw new Error('Servo range is not defined');
      }
      return range;
    }
    return binding.range;
  }

  private getAposCenter(
    binding: ControlSchemeServoBinding,
    ioProps: Omit<AttachedIoPropsModel, 'hubId' | 'portId'> | null,
  ): number {
    if (binding.calibrateOnStart) {
      const center = ioProps?.startupServoCalibrationData?.aposCenter;
      if (center === undefined) {
        throw new Error('Servo center is not defined');
      }
      return center;
    }
    return binding.aposCenter;
  }
}
