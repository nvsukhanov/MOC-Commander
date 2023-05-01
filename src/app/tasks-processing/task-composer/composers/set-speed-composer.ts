import { PortCommandTaskComposer } from '../port-command-task-composer';
import { ControlSchemeBinding, HubIoOperationMode } from '../../../store';
import { MOTOR_LIMITS } from '../../../lego-hub';
import { PortCommandSetLinearSpeedTask, PortCommandTask, PortCommandTaskType } from '../../../common';

export class SetSpeedComposer extends PortCommandTaskComposer {
    protected handle(
        binding: ControlSchemeBinding,
        inputValue: number,
        previousTask?: PortCommandTask,
    ): PortCommandSetLinearSpeedTask | null {
        if (binding.output.operationMode !== HubIoOperationMode.Linear) {
            return null;
        }

        if (binding.output.configuration.isToggle && inputValue === 0) {
            return null;
        }

        const targetSpeed = this.calculateSpeed(
            inputValue,
            binding.output.configuration.maxSpeed,
            previousTask?.bindingId === binding.id ? previousTask.speed : undefined,
            binding.output.configuration.isToggle,
            binding.output.configuration.invert,
        );

        return {
            taskType: PortCommandTaskType.SetSpeed,
            portId: binding.output.portId,
            hubId: binding.output.hubId,
            speed: targetSpeed,
            power: binding.output.configuration.power,
            bindingId: binding.id,
            isNeutral: targetSpeed === 0 || binding.output.configuration.isToggle,
            createdAt: Date.now(),
        } satisfies PortCommandSetLinearSpeedTask;
    }

    private calculateSpeed(
        inputValue: number,
        maxAbsSpeed: number,
        previousValue: number | undefined,
        isToggle: boolean,
        invert: boolean,
    ): number {
        if (isToggle && previousValue !== undefined && previousValue !== 0) {
            return 0;
        }
        const direction = invert ? -1 : 1;

        const clampedSpeed = this.clampSpeed(
            inputValue * direction * maxAbsSpeed,
            Math.min(maxAbsSpeed, MOTOR_LIMITS.maxAbsSpeed),
        );

        return this.snapSpeedToZero(clampedSpeed);
    }

    private clampSpeed(
        speed: number,
        maxAbsSpeed: number,
    ): number {
        if (Math.abs(speed) > maxAbsSpeed) {
            return maxAbsSpeed * Math.sign(speed);
        }
        return speed;
    }

    private snapSpeedToZero(
        speed: number,
    ): number {
        return Math.abs(speed) < MOTOR_LIMITS.minAbsSpeed ? 0 : speed;
    }
}
