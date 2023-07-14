import { MOTOR_LIMITS } from '@nvsukhanov/rxpoweredup';

import { PortCommandTaskBuilder } from '../port-command-task-builder';
import { BindingLinearOutputState, ControlSchemeBinding, PortCommandTask, PortCommandTaskType, SetLinearSpeedTaskPayload } from '../../../../models';
import { HubIoOperationMode } from '@app/shared';

export class SetSpeedTaskBuilder extends PortCommandTaskBuilder<SetLinearSpeedTaskPayload> {
    private readonly speedStep = 5;

    private readonly speedSnapThreshold = 10;

    protected buildPayload(
        binding: ControlSchemeBinding,
        inputValue: number,
        motorEncoderOffset: number,
        lastExecutedTask: PortCommandTask | null
    ): SetLinearSpeedTaskPayload | null {
        if (binding.output.operationMode !== HubIoOperationMode.Linear) {
            return null;
        }

        if (binding.output.linearConfig.isToggle) {
            if (inputValue === 0) {
                return null;
            }
            return this.createTogglePayload(binding.id, binding.output, lastExecutedTask);
        }

        const targetSpeed = this.calculateSpeed(
            inputValue,
            binding.output.linearConfig.maxSpeed,
            binding.output.linearConfig.invert,
        );

        return {
            taskType: PortCommandTaskType.SetSpeed,
            speed: targetSpeed,
            power: this.calculatePower(targetSpeed, binding.output.linearConfig.power),
            activeInput: inputValue !== 0,
        };
    }

    protected calculatePayloadHash(
        payload: SetLinearSpeedTaskPayload
    ): string {
        return [
            payload.taskType,
            payload.speed,
            payload.power,
        ].join('_');
    }

    private createTogglePayload(
        bindingId: string,
        outputConfig: BindingLinearOutputState,
        lastExecutedTask: PortCommandTask | null
    ): SetLinearSpeedTaskPayload | null {
        let shouldActivate: boolean;

        if (lastExecutedTask?.bindingId === bindingId) {
            shouldActivate = (lastExecutedTask.payload as SetLinearSpeedTaskPayload).speed === 0;
        } else {
            shouldActivate = true;
        }

        if (shouldActivate) {
            const speed = this.calculateSpeed(1, outputConfig.linearConfig.maxSpeed, outputConfig.linearConfig.invert);
            return {
                taskType: PortCommandTaskType.SetSpeed,
                speed,
                power: this.calculatePower(speed, outputConfig.linearConfig.power),
                activeInput: true,
            };
        }

        return {
            taskType: PortCommandTaskType.SetSpeed,
            speed: 0,
            power: this.calculatePower(0, outputConfig.linearConfig.power),
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
