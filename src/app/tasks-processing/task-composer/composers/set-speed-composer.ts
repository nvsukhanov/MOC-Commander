import { PortCommandTaskComposer } from '../port-command-task-composer';
import { AttachedIOState, ControlSchemeBinding, HubIoOperationMode } from '../../../store';
import { MOTOR_LIMITS } from '@nvsukhanov/rxpoweredup';
import { PortCommandSetLinearSpeedTask, PortCommandTask, PortCommandTaskType } from '../../../common';

export class SetSpeedComposer extends PortCommandTaskComposer {
    private readonly speedSnapToZero = 15;

    protected handle(
        binding: ControlSchemeBinding,
        inputValue: number,
        ioState: AttachedIOState,
        previousTask?: PortCommandTask,
    ): PortCommandSetLinearSpeedTask | null {
        if (binding.output.operationMode !== HubIoOperationMode.Linear) {
            return null;
        }

        if (binding.output.linearConfig.isToggle && inputValue === 0) {
            return null;
        }

        const targetSpeed = this.calculateSpeed(
            inputValue,
            binding.output.linearConfig.maxSpeed,
            previousTask?.bindingId === binding.id ? previousTask.speed : undefined,
            binding.output.linearConfig.isToggle,
            binding.output.linearConfig.invert,
        );

        return {
            taskType: PortCommandTaskType.SetSpeed,
            portId: binding.output.portId,
            hubId: binding.output.hubId,
            speed: targetSpeed,
            power: targetSpeed !== 0 ? binding.output.linearConfig.power : 0,
            bindingId: binding.id,
            isNeutral: targetSpeed === 0 || binding.output.linearConfig.isToggle,
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
            Math.min(maxAbsSpeed, MOTOR_LIMITS.maxSpeed),
        );

        return Math.round(this.snapSpeedToZero(clampedSpeed));
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
        return Math.abs(speed) < this.speedSnapToZero ? 0 : speed;
    }
}
