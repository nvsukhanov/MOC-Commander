import { MotorServoEndState } from '@nvsukhanov/rxpoweredup';
import { HubIoOperationMode, getTranslationArcs } from '@app/shared';

import { BaseTaskBuilder } from './base-task-builder';
import { ControlSchemeV2Binding, PortCommandTaskType, ServoTaskPayload } from '../../../models';

export class ServoTaskBuilder extends BaseTaskBuilder<ServoTaskPayload> {
    private readonly snappingThreshold = 10;

    protected buildPayload(
        binding: ControlSchemeV2Binding,
        inputValue: number,
        motorEncoderOffset: number,
    ): ServoTaskPayload | null {
        if (binding.operationMode !== HubIoOperationMode.Servo) {
            return null;
        }

        const translationPaths = getTranslationArcs(motorEncoderOffset, binding.aposCenter);
        const resultingCenter = translationPaths.cw < translationPaths.ccw ? translationPaths.cw : -translationPaths.ccw;

        const arcSize = binding.range;
        const arcPosition = inputValue * arcSize / 2 * (binding.invert ? -1 : 1);

        const targetAngle = arcPosition + resultingCenter;
        const minAngle = resultingCenter - arcSize / 2;
        const maxAngle = resultingCenter + arcSize / 2;

        const snappedAngle = this.snapAngle(targetAngle, resultingCenter, minAngle, maxAngle);

        return {
            taskType: PortCommandTaskType.Servo,
            angle: Math.round(snappedAngle),
            speed: Math.round(binding.speed),
            power: binding.power,
            endState: MotorServoEndState.hold,
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
