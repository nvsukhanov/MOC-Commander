import { MotorServoEndState } from '@nvsukhanov/rxpoweredup';

import { PortCommandServoTask, PortCommandTaskType, getTranslationArcs } from '@app/shared';
import { PortCommandTaskComposer } from '../port-command-task-composer';
import { AttachedIoProps, BindingServoOutputState, ControlSchemeBinding, HubIoOperationMode } from '../../../store';

export class ServoComposer extends PortCommandTaskComposer {
    private readonly snappingThreshold = 10;

    protected handle(
        binding: ControlSchemeBinding,
        inputValue: number,
        ioState?: AttachedIoProps
    ): PortCommandServoTask | null {
        const outputConfig = binding.output;
        if (outputConfig.operationMode !== HubIoOperationMode.Servo || ioState === undefined || ioState.motorEncoderOffset === null) {
            return null;
        }

        const translationPaths = getTranslationArcs(ioState.motorEncoderOffset, outputConfig.servoConfig.aposCenter);
        const resultingCenter = translationPaths.cw < translationPaths.ccw ? translationPaths.cw : -translationPaths.ccw;

        const arcSize = outputConfig.servoConfig.range;
        const arcPosition = inputValue * arcSize / 2 * (outputConfig.servoConfig.invert ? -1 : 1);

        const targetAngle = arcPosition + resultingCenter;
        const minAngle = resultingCenter - arcSize / 2;
        const maxAngle = resultingCenter + arcSize / 2;

        const snappedAngle = this.snapAngle(targetAngle, resultingCenter, minAngle, maxAngle);

        return this.composeServoTask(
            binding.id,
            outputConfig,
            snappedAngle,
            outputConfig.servoConfig.speed,
            resultingCenter
        );
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

    private composeServoTask(
        bindingId: string,
        outputState: BindingServoOutputState,
        targetAngle: number,
        targetSpeed: number,
        arcCenter: number
    ): PortCommandServoTask {
        return {
            taskType: PortCommandTaskType.Servo,
            hubId: outputState.hubId,
            portId: outputState.portId,
            bindingId: bindingId,
            isNeutral: Math.round(targetAngle) === arcCenter,
            angle: Math.round(targetAngle),
            speed: Math.round(targetSpeed),
            power: outputState.servoConfig.power,
            endState: MotorServoEndState.hold,
            createdAt: Date.now(),
        };
    }
}
