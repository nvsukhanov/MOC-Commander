import { HubIoOperationMode } from '@app/shared';

import { BaseTaskBuilder } from './base-task-builder';
import { ControlSchemeV2Binding, PortCommandTaskType, SetAngleTaskPayload } from '../../../models';

export class SetAngleTaskBuilder extends BaseTaskBuilder<SetAngleTaskPayload> {
    private readonly inputValueThreshold = 0.5;

    protected buildPayload(
        binding: ControlSchemeV2Binding,
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
}
