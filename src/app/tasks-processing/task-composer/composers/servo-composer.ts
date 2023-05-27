import { PortCommandTaskComposer } from '../port-command-task-composer';
import { getTranslationArcs, PortCommandServoTask, PortCommandTaskType } from '../../../common';
import { AttachedIOState, BindingServoOutputState, ControlSchemeBinding, HubIoOperationMode } from '../../../store';
import { MotorServoEndState } from '@nvsukhanov/rxpoweredup';

export class ServoComposer extends PortCommandTaskComposer {
    private readonly snappingThreshold = 10;

    protected handle(
        binding: ControlSchemeBinding,
        inputValue: number,
        ioState?: AttachedIOState
    ): PortCommandServoTask | null {
        const outputConfig = binding.output;
        if (outputConfig.operationMode !== HubIoOperationMode.Servo || ioState === undefined || ioState.motorEncoderOffset === null) {
            return null;
        }

        const translationPaths = getTranslationArcs(ioState.motorEncoderOffset, outputConfig.servoConfig.aposCenter);
        const resultingCenter = translationPaths.cw < translationPaths.ccw ? translationPaths.cw : -translationPaths.ccw;

        const arcSize = outputConfig.servoConfig.range;
        const arcPosition = inputValue * arcSize / 2;

        const targetAngle = arcPosition + resultingCenter;
        const minAngle = resultingCenter - arcSize / 2;
        const maxAngle = resultingCenter + arcSize / 2;

        const snappedAngle = this.snapAngle(targetAngle, resultingCenter, minAngle, maxAngle);

        return this.composeServoTask(
            binding.id,
            outputConfig,
            snappedAngle,
            outputConfig.servoConfig.speed
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
        targetSpeed: number
    ): PortCommandServoTask {
        return {
            taskType: PortCommandTaskType.Servo,
            hubId: outputState.hubId,
            portId: outputState.portId,
            bindingId: bindingId,
            isNeutral: Math.round(targetAngle) === 0,
            angle: Math.round(targetAngle),
            speed: Math.round(targetSpeed),
            power: outputState.servoConfig.power,
            endState: MotorServoEndState.hold,
            createdAt: Date.now(),
        };
    }
}
