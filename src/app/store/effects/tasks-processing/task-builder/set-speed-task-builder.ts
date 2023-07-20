import { MOTOR_LIMITS } from '@nvsukhanov/rxpoweredup';
import { HubIoOperationMode } from '@app/shared';

import { BaseTaskBuilder } from './base-task-builder';
import { ControlSchemeV2Binding, ControlSchemeV2LinearBinding, PortCommandTask, PortCommandTaskType, SetLinearSpeedTaskPayload } from '../../../models';

export class SetSpeedTaskBuilder extends BaseTaskBuilder<SetLinearSpeedTaskPayload> {
    private readonly speedStep = 5;

    private readonly speedSnapThreshold = 10;

    protected buildPayload(
        binding: ControlSchemeV2Binding,
        inputValue: number,
        motorEncoderOffset: number,
        lastExecutedTask: PortCommandTask | null
    ): SetLinearSpeedTaskPayload | null {
        if (binding.operationMode !== HubIoOperationMode.Linear) {
            return null;
        }

        if (binding.isToggle) {
            if (inputValue === 0) {
                return null;
            }
            return this.createTogglePayload(binding, lastExecutedTask);
        }

        const targetSpeed = this.calculateSpeed(
            inputValue,
            binding.maxSpeed,
            binding.invert,
        );

        return {
            taskType: PortCommandTaskType.SetSpeed,
            speed: targetSpeed,
            power: this.calculatePower(targetSpeed, binding.power),
            activeInput: inputValue !== 0,
        };
    }

    private createTogglePayload(
        binding: ControlSchemeV2LinearBinding,
        lastExecutedTask: PortCommandTask | null
    ): SetLinearSpeedTaskPayload | null {
        let shouldActivate: boolean;

        if (lastExecutedTask?.bindingId === binding.id) {
            shouldActivate = (lastExecutedTask.payload as SetLinearSpeedTaskPayload).speed === 0;
        } else {
            shouldActivate = true;
        }

        if (shouldActivate) {
            const speed = this.calculateSpeed(1, binding.maxSpeed, binding.invert);
            return {
                taskType: PortCommandTaskType.SetSpeed,
                speed,
                power: this.calculatePower(speed, binding.power),
                activeInput: true,
            };
        }

        return {
            taskType: PortCommandTaskType.SetSpeed,
            speed: 0,
            power: this.calculatePower(0, binding.power),
            activeInput: true,
        };
    }

    private calculateSpeed(
        inputValue: number,
        maxAbsSpeed: number,
        invert: boolean,
    ): number {
        const clampedSpeed = this.clampSpeed(inputValue * maxAbsSpeed);
        const direction = invert ? -1 : 1;

        return this.snapSpeed(clampedSpeed * direction);
    }

    private clampSpeed(
        speed: number,
    ): number {
        return Math.abs(speed) > MOTOR_LIMITS.maxSpeed
               ? MOTOR_LIMITS.maxSpeed * Math.sign(speed)
               : speed;
    }

    private snapSpeed(
        speed: number,
    ): number {
        const speedWithStep = Math.round(speed / this.speedStep) * this.speedStep;
        if (Math.abs(speedWithStep) < this.speedSnapThreshold) {
            return 0;
        }
        if (Math.abs(speedWithStep) >= MOTOR_LIMITS.maxSpeed - this.speedSnapThreshold) {
            return MOTOR_LIMITS.maxSpeed * Math.sign(speedWithStep);
        }
        return speed;
    }

    private calculatePower(
        speed: number,
        maxPower: number
    ): number {
        if (speed === 0) {
            return 0;
        }
        return maxPower;
    }
}
