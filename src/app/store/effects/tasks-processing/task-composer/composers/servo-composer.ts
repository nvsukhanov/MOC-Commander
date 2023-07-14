import { MotorServoEndState } from '@nvsukhanov/rxpoweredup';

import { PortCommandTaskComposer } from '../port-command-task-composer';
import { ControlSchemeBinding } from '../../../../models';
import { HubIoOperationMode, PortCommandTaskType, ServoTaskPayload, getTranslationArcs } from '@app/shared';

export class ServoComposer extends PortCommandTaskComposer<ServoTaskPayload> {
    private readonly snappingThreshold = 10;

    protected composePayload(
        binding: ControlSchemeBinding,
        inputValue: number,
        motorEncoderOffset: number,
    ): ServoTaskPayload | null {
        const outputConfig = binding.output;
        if (outputConfig.operationMode !== HubIoOperationMode.Servo) {
            return null;
        }

        const translationPaths = getTranslationArcs(motorEncoderOffset, outputConfig.servoConfig.aposCenter);
        const resultingCenter = translationPaths.cw < translationPaths.ccw ? translationPaths.cw : -translationPaths.ccw;

        const arcSize = outputConfig.servoConfig.range;
        const arcPosition = inputValue * arcSize / 2 * (outputConfig.servoConfig.invert ? -1 : 1);

        const targetAngle = arcPosition + resultingCenter;
        const minAngle = resultingCenter - arcSize / 2;
        const maxAngle = resultingCenter + arcSize / 2;

        const snappedAngle = this.snapAngle(targetAngle, resultingCenter, minAngle, maxAngle);

        return {
            taskType: PortCommandTaskType.Servo,
            angle: Math.round(snappedAngle),
            speed: Math.round(outputConfig.servoConfig.speed),
            power: outputConfig.servoConfig.power,
            endState: MotorServoEndState.hold,
        };
    }

    protected calculatePayloadHash(
        payload: ServoTaskPayload
    ): string {
        return [
            payload.taskType,
            payload.angle,
            payload.speed,
            payload.power,
            payload.endState
        ].join('_');
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
