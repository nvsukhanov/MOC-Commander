import { HubIoOperationMode } from '@app/shared';

import { BaseTaskBuilder } from './base-task-builder';
import { ControlSchemeBinding, PortCommandTask, PortCommandTaskPayload, PortCommandTaskType, StepperTaskPayload } from '../../../models';

export class StepperTaskBuilder extends BaseTaskBuilder {
    protected buildPayload(
        binding: ControlSchemeBinding,
        inputValue: number,
    ): StepperTaskPayload | null {
        if (binding.operationMode !== HubIoOperationMode.Stepper) {
            return null;
        }

        if (inputValue < 0.5) {
            return null;
        }

        return {
            taskType: PortCommandTaskType.Stepper,
            degree: binding.degree,
            speed: binding.speed,
            power: binding.power,
            endState: binding.endState,
        };
    }

    protected buildCleanupPayload(
        previousTask: PortCommandTask
    ): PortCommandTaskPayload | null {
        if (previousTask.payload.taskType !== PortCommandTaskType.Stepper) {
            return null;
        }
        return {
            taskType: PortCommandTaskType.SetSpeed,
            speed: 0,
            power: 0,
            activeInput: false
        };
    }
}
