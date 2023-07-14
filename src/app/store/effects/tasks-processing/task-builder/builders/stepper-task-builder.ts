import { PortCommandTaskBuilder } from '../port-command-task-builder';
import { ControlSchemeBinding, PortCommandTaskType, StepperTaskPayload } from '../../../../models';
import { HubIoOperationMode } from '@app/shared';

export class StepperTaskBuilder extends PortCommandTaskBuilder<StepperTaskPayload> {
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

    protected calculatePayloadHash(
        payload: StepperTaskPayload
    ): string {
        return [
            payload.taskType,
            payload.degree,
            payload.speed,
            payload.power,
            payload.endState
        ].join('_');
    }
}
