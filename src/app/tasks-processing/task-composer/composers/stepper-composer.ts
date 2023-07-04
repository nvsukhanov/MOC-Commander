import { PortCommandTaskComposer } from '../port-command-task-composer';
import { ControlSchemeBinding } from '../../../store';
import { HubIoOperationMode, PortCommandStepperTask, PortCommandTaskType } from '@app/shared';

export class StepperComposer extends PortCommandTaskComposer {
    protected handle(
        binding: ControlSchemeBinding,
        inputValue: number,
    ): PortCommandStepperTask | null {
        if (binding.output.operationMode !== HubIoOperationMode.Stepper) {
            return null;
        }

        if (inputValue < 0.5) {
            return null;
        }

        return {
            taskType: PortCommandTaskType.Stepper,
            hubId: binding.output.hubId,
            portId: binding.output.portId,
            bindingId: binding.id,
            isNeutral: true,
            degree: binding.output.stepperConfig.degree,
            speed: binding.output.stepperConfig.speed,
            power: binding.output.stepperConfig.power,
            endState: binding.output.stepperConfig.endState,
            createdAt: Date.now(),
        } satisfies PortCommandStepperTask;
    }
}
