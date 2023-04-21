import { PortCommandTaskComposer } from '../port-command-task-composer';
import { ControlSchemeBinding, HubIoOperationMode, HubIOState } from '../../../store';
import { MotorFeature } from '../../../lego-hub/features';
import { PortCommandSetLinearSpeedTask, PortCommandTaskType } from '../port-command-task';

export class SetSpeedComposer extends PortCommandTaskComposer {
    private readonly resultingSpeedThreshold = 10;

    protected handle(
        binding: ControlSchemeBinding,
        inputValue: number,
        currentState?: HubIOState,
    ): PortCommandSetLinearSpeedTask | null {
        if (binding.output.operationMode !== HubIoOperationMode.Linear) {
            return null;
        }
        const currentSpeed = currentState?.values[0];
        const targetSpeed = Math.round(inputValue * MotorFeature.maxSpeed);

        if (currentSpeed === undefined || Math.abs(currentSpeed - targetSpeed) > this.resultingSpeedThreshold) {
            return {
                taskType: PortCommandTaskType.SetSpeed,
                portId: binding.output.portId,
                speed: targetSpeed,
            };
        }
        return null;
    }
}
