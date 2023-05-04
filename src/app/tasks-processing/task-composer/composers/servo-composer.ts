import { PortCommandTaskComposer } from '../port-command-task-composer';
import { PortCommandServoTask, PortCommandTaskType } from '../../../common';
import { BindingServoOutputState, ControlSchemeBinding, HubIoOperationMode } from '../../../store';
import { MotorServoEndState } from '../../../lego-hub';

export class ServoComposer extends PortCommandTaskComposer {
    private readonly snappingThreshold = 5;

    protected handle(
        binding: ControlSchemeBinding,
        inputValue: number,
    ): PortCommandServoTask | null {
        const outputConfig = binding.output;
        if (outputConfig.operationMode !== HubIoOperationMode.Servo) {
            return null;
        }

        const arcCenter = (outputConfig.servoConfig.maxAngle + outputConfig.servoConfig.minAngle) / 2;
        const arcSize = outputConfig.servoConfig.maxAngle - outputConfig.servoConfig.minAngle;
        const targetAngle = inputValue * arcSize / 2 + arcCenter;

        const snappedAngle = this.snapAngle(targetAngle, arcCenter, outputConfig.servoConfig.maxAngle, outputConfig.servoConfig.minAngle);

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
        const snappedToZeroAngle = Math.abs(targetAngle - arcCenter) < this.snappingThreshold ? 0 : targetAngle;
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
            endState: MotorServoEndState.brake,
            createdAt: Date.now(),
        };
    }
}
