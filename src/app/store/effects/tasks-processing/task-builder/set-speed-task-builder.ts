import { MOTOR_LIMITS } from '@nvsukhanov/rxpoweredup';
import { Dictionary } from '@ngrx/entity';
import { HubIoOperationMode } from '@app/shared';
import { InputGain, controllerInputIdFn } from '@app/store';

import { BaseTaskBuilder } from './base-task-builder';
import {
    ControlSchemeBinding,
    ControlSchemeLinearBinding,
    ControllerInputModel,
    PortCommandTask,
    PortCommandTaskPayload,
    PortCommandTaskType,
    SetLinearSpeedTaskPayload
} from '../../../models';
import { calcInputGain } from './calc-input-gain';

export class SetSpeedTaskBuilder extends BaseTaskBuilder {
    private readonly speedStep = 5;

    private readonly speedSnapThreshold = 10;

    protected buildPayload(
        binding: ControlSchemeBinding,
        inputsState: Dictionary<ControllerInputModel>,
        motorEncoderOffset: number,
        lastExecutedTask: PortCommandTask | null
    ): { payload: SetLinearSpeedTaskPayload; inputTimestamp: number } | null {
        if (binding.operationMode !== HubIoOperationMode.Linear) {
            return null;
        }

        const inputRecord = inputsState[controllerInputIdFn(binding)];
        const inputValue = inputRecord?.value ?? 0;

        if (binding.isToggle) {
            if (inputValue === 0) {
                return null;
            }
            const payload = this.createTogglePayload(binding, lastExecutedTask);
            if (payload) {
                return { payload, inputTimestamp: inputRecord?.timestamp ?? Date.now() };
            }
            return null;
        }

        const targetSpeed = this.calculateSpeed(
            inputValue,
            binding.maxSpeed,
            binding.invert,
            binding.inputGain
        );

        const payload: SetLinearSpeedTaskPayload = {
            taskType: PortCommandTaskType.SetSpeed,
            speed: targetSpeed,
            power: this.calculatePower(targetSpeed, binding.power),
            activeInput: inputValue !== 0,
            useAccelerationProfile: binding.useAccelerationProfile,
            useDecelerationProfile: binding.useDecelerationProfile
        };

        return { payload, inputTimestamp: inputRecord?.timestamp ?? Date.now() };
    }

    protected buildCleanupPayload(
        previousTask: PortCommandTask
    ): PortCommandTaskPayload | null {
        if (previousTask.payload.taskType !== PortCommandTaskType.SetSpeed) {
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

    private createTogglePayload(
        binding: ControlSchemeLinearBinding,
        lastExecutedTask: PortCommandTask | null
    ): SetLinearSpeedTaskPayload | null {
        let shouldActivate: boolean;

        if (lastExecutedTask?.bindingId === binding.id) {
            shouldActivate = (lastExecutedTask.payload as SetLinearSpeedTaskPayload).speed === 0;
        } else {
            shouldActivate = true;
        }

        if (shouldActivate) {
            const speed = this.calculateSpeed(1, binding.maxSpeed, binding.invert, binding.inputGain);
            return {
                taskType: PortCommandTaskType.SetSpeed,
                speed,
                power: this.calculatePower(speed, binding.power),
                activeInput: true,
                useAccelerationProfile: binding.useAccelerationProfile,
                useDecelerationProfile: binding.useDecelerationProfile
            };
        }

        return {
            taskType: PortCommandTaskType.SetSpeed,
            speed: 0,
            power: this.calculatePower(0, binding.power),
            activeInput: true,
            useAccelerationProfile: binding.useAccelerationProfile,
            useDecelerationProfile: binding.useDecelerationProfile
        };
    }

    private calculateSpeed(
        inputValue: number,
        maxAbsSpeed: number,
        invert: boolean,
        inputGain: InputGain
    ): number {
        const clampedSpeed = this.clampSpeed(
            calcInputGain(inputValue, inputGain) * maxAbsSpeed
        );
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
