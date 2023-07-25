import { HubIoOperationMode } from '@app/shared';

import { BaseTaskBuilder } from './base-task-builder';
import { ControlSchemeBinding, PortCommandTask, PortCommandTaskPayload, PortCommandTaskType, SetAngleTaskPayload } from '../../../models';

export class SetAngleTaskBuilder extends BaseTaskBuilder {
    private readonly inputValueThreshold = 0.5;

    protected buildPayload(
        binding: ControlSchemeBinding,
        inputValue: number
    ): SetAngleTaskPayload | null {
        if (binding.operationMode !== HubIoOperationMode.SetAngle) {
            return null;
        }
        if (inputValue < this.inputValueThreshold) {
            return null;
        }
        return {
            taskType: PortCommandTaskType.SetAngle,
            angle: binding.angle,
            speed: binding.speed,
            power: binding.power,
            endState: binding.endState,
        };
    }

    protected buildCleanupPayload(
        previousTask: PortCommandTask
    ): PortCommandTaskPayload | null {
        if (previousTask.payload.taskType !== PortCommandTaskType.SetAngle) {
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
