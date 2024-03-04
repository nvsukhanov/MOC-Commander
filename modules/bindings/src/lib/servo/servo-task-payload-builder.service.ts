import { MotorServoEndState } from 'rxpoweredup';
import { Injectable } from '@angular/core';
import { ControlSchemeBindingType, getTranslationArcs } from '@app/shared-misc';
import {
    AttachedIoPropsModel,
    ControlSchemeInputAction,
    ControlSchemeServoBinding,
    InputDirection,
    PortCommandTask,
    PortCommandTaskPayload,
    ServoTaskPayload
} from '@app/store';

import { calcInputGain, extractDirectionAwareInputValue } from '../common';
import { ITaskPayloadBuilder } from '../i-task-payload-factory';
import { BindingInputExtractionResult } from '../i-binding-task-input-extractor';

@Injectable()
export class ServoTaskPayloadBuilderService implements ITaskPayloadBuilder<ControlSchemeBindingType.Servo> {
    private readonly snappingThreshold = 10;

    public buildPayload(
        binding: ControlSchemeServoBinding,
        currentInput: BindingInputExtractionResult<ControlSchemeBindingType.Servo>,
        _: BindingInputExtractionResult<ControlSchemeBindingType.Servo>,
        ioProps: Omit<AttachedIoPropsModel, 'hubId' | 'portId'> | null,
        previousTaskPayload: PortCommandTask | null
    ): { payload: ServoTaskPayload; inputTimestamp: number } | null {
        const cwInput = currentInput[ControlSchemeInputAction.ServoCw];
        const ccwInput = currentInput[ControlSchemeInputAction.ServoCcw];

        if (!cwInput && !ccwInput && !!previousTaskPayload) {
            // If this is not the first task and there is no input - we do nothing
            return null;
        }

        const translationPaths = getTranslationArcs(
            ioProps?.motorEncoderOffset ?? 0,
            this.getArcCenter(binding, ioProps)
        );
        const resultingCenter = translationPaths.cw < translationPaths.ccw ? translationPaths.cw : -translationPaths.ccw;

        if (!cwInput && !ccwInput) {
            // If there were no inputs and no previous task, we should center the servo
            return this.composeResult(
                resultingCenter,
                binding.speed,
                binding.power,
                binding.useAccelerationProfile,
                binding.useDecelerationProfile,
                0
            );
        }

        const cwInputDirection = binding.inputs[ControlSchemeInputAction.ServoCw]?.inputDirection ?? InputDirection.Positive;
        const ccwInputDirection = binding.inputs[ControlSchemeInputAction.ServoCcw]?.inputDirection ?? InputDirection.Positive;
        const cwValue = extractDirectionAwareInputValue(cwInput?.value ?? 0, cwInputDirection);
        const ccwValue = extractDirectionAwareInputValue(ccwInput?.value ?? 0, ccwInputDirection);

        const servoCwInputValue = calcInputGain(cwValue, binding.inputs[ControlSchemeInputAction.ServoCw]?.gain);
        const servoCcwInputValue = calcInputGain(ccwValue, binding.inputs[ControlSchemeInputAction.ServoCcw]?.gain);
        const servoNonClampedInputValue = -Math.abs(servoCcwInputValue) + Math.abs(servoCwInputValue);

        // TODO: create a function to clamp the value
        const servoInputValue = Math.max(-1, Math.min(1, servoNonClampedInputValue));
        const inputTimestamp = Math.max(cwInput?.timestamp ?? 0, ccwInput?.timestamp ?? 0);

        const arcSize = this.getArcSize(binding, ioProps);
        const arcPosition = servoInputValue * arcSize / 2;

        const targetAngle = arcPosition + resultingCenter;
        const minAngle = resultingCenter - arcSize / 2;
        const maxAngle = resultingCenter + arcSize / 2;

        const snappedAngle = this.snapAngle(targetAngle, resultingCenter, minAngle, maxAngle);

        return this.composeResult(
            snappedAngle,
            binding.speed,
            binding.power,
            binding.useAccelerationProfile,
            binding.useDecelerationProfile,
            inputTimestamp
        );
    }

    public buildCleanupPayload(
        previousTask: PortCommandTask
    ): PortCommandTaskPayload | null {
        if (previousTask.payload.bindingType !== ControlSchemeBindingType.Servo) {
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

    private composeResult(
        angle: number,
        speed: number,
        power: number,
        useAccelerationProfile: boolean,
        useDecelerationProfile: boolean,
        inputTimestamp: number
    ): { payload: ServoTaskPayload; inputTimestamp: number } {
        return {
            payload: {
                bindingType: ControlSchemeBindingType.Servo,
                angle: Math.round(angle),
                speed,
                power,
                endState: MotorServoEndState.hold,
                useAccelerationProfile,
                useDecelerationProfile,
            },
            inputTimestamp
        };
    }

    private snapAngle(
        targetAngle: number,
        arcCenter: number,
        maxAngle: number,
        minAngle: number
    ): number {
        const snappedToZeroAngle = Math.abs(targetAngle - arcCenter) < this.snappingThreshold ? arcCenter : targetAngle;
        const snappedToMaxAngle = Math.abs(snappedToZeroAngle - maxAngle) < this.snappingThreshold ? maxAngle : snappedToZeroAngle;
        return Math.abs(snappedToMaxAngle - minAngle) < this.snappingThreshold ? minAngle : snappedToMaxAngle;
    }

    private getArcSize(
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

    private getArcCenter(
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
