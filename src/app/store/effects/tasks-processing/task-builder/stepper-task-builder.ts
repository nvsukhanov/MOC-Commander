import { HubIoOperationMode } from '@app/shared';

import { BaseTaskBuilder } from './base-task-builder';
import { ControlSchemeBinding, PortCommandTaskType, StepperTaskPayload } from '../../../models';

export class StepperTaskBuilder extends BaseTaskBuilder<StepperTaskPayload> {
    protected buildPayload(
        binding: ControlSchemeBinding,
        inputValue: number,
    ): StepperTaskPayload | null {
        if (binding.output.operationMode !== HubIoOperationMode.Stepper) {
            return null;
        }

        if (inputValue < 0.5) {
            return null;
        }

        return {
            taskType: PortCommandTaskType.Stepper,
            degree: binding.output.stepperConfig.degree,
            speed: binding.output.stepperConfig.speed,
            power: binding.output.stepperConfig.power,
            endState: binding.output.stepperConfig.endState,
        };
    }
}
