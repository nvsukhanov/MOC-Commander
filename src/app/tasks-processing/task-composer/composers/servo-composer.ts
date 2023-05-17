import { PortCommandTaskComposer } from '../port-command-task-composer';
import { PortCommandServoTask, PortCommandTaskType } from '../../../common';
import { BindingServoOutputState, ControlSchemeBinding, HubIoOperationMode } from '../../../store';
import { MotorServoEndState } from '@nvsukhanov/poweredup-api';

export class ServoComposer extends PortCommandTaskComposer {
    private readonly snappingThreshold = 10;

    private readonly stickToZeroThreshold = 10;

    private readonly stickToMaxThreshold = 10;

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
        // There is no reason to move servo to new position if delta is less than threshold bc there of a natural limitations of servo's encoder
        const snappedAngle = Math.round(targetAngle / this.snappingThreshold) * this.snappingThreshold;

        // If target angle is close to zero, then we should stick to zero
        if (Math.abs(snappedAngle - arcCenter) <= this.stickToZeroThreshold) {
            return arcCenter;
        }

        // If target angle is close to max, then we should stick to max
        if (Math.abs(snappedAngle - maxAngle) <= this.stickToMaxThreshold) {
            return maxAngle;
        }

        // If target angle is close to min, then we should stick to min
        if (Math.abs(snappedAngle - minAngle) <= this.stickToMaxThreshold) {
            return minAngle;
        }

        return snappedAngle;
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
