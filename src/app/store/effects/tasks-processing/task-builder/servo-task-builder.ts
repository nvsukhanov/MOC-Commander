import { MotorServoEndState } from '@nvsukhanov/rxpoweredup';
import { Dictionary } from '@ngrx/entity';
import { HubIoOperationMode, getTranslationArcs } from '@app/shared';
import { controllerInputIdFn } from '@app/store';

import { BaseTaskBuilder } from './base-task-builder';
import { ControlSchemeBinding, ControllerInputModel, PortCommandTask, PortCommandTaskPayload, PortCommandTaskType, ServoTaskPayload } from '../../../models';
import { calcInputGain } from './calc-input-gain';

export class ServoTaskBuilder extends BaseTaskBuilder {
    private readonly snappingThreshold = 10;

    protected buildPayload(
        binding: ControlSchemeBinding,
        inputsState: Dictionary<ControllerInputModel>,
        motorEncoderOffset: number,
    ): { payload: ServoTaskPayload; inputTimestamp: number } | null {
        if (binding.operationMode !== HubIoOperationMode.Servo) {
            return null;
        }

        const servoInput = inputsState[controllerInputIdFn(binding.inputs.servo)];
        const servoInputValue = calcInputGain(servoInput?.value ?? 0, binding.inputs.servo.gain);

        const translationPaths = getTranslationArcs(motorEncoderOffset, binding.aposCenter);
        const resultingCenter = translationPaths.cw < translationPaths.ccw ? translationPaths.cw : -translationPaths.ccw;

        const arcSize = binding.range;
        const arcPosition = servoInputValue * arcSize / 2 * (binding.invert ? -1 : 1);

        const targetAngle = arcPosition + resultingCenter;
        const minAngle = resultingCenter - arcSize / 2;
        const maxAngle = resultingCenter + arcSize / 2;

        const snappedAngle = this.snapAngle(targetAngle, resultingCenter, minAngle, maxAngle);

        const payload: ServoTaskPayload = {
            taskType: PortCommandTaskType.Servo,
            angle: Math.round(snappedAngle),
            speed: Math.round(binding.speed),
            power: binding.power,
            endState: MotorServoEndState.hold,
            useAccelerationProfile: binding.useAccelerationProfile,
            useDecelerationProfile: binding.useDecelerationProfile,
        };
        return { payload, inputTimestamp: servoInput?.timestamp ?? Date.now() };
    }

    protected buildCleanupPayload(
        previousTask: PortCommandTask
    ): PortCommandTaskPayload | null {
        if (previousTask.payload.taskType !== PortCommandTaskType.Servo) {
            return null;
        }
        return {
            taskType: PortCommandTaskType.SetSpeed,
            speed: 0,
            power: 0,
            activeInput: false,
            useAccelerationProfile: previousTask.payload.useAccelerationProfile,
            useDecelerationProfile: previousTask.payload.useDecelerationProfile
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
}
