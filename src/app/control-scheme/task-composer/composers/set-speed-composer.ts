import { PortCommandTaskComposer } from '../port-command-task-composer';
import { ControlSchemeBinding, HubIoOperationMode } from '../../../store';
import { MotorFeature } from '../../../lego-hub/features';
import { PortCommandSetLinearSpeedTask, PortCommandTaskType } from '../port-command-task';

export class SetSpeedComposer extends PortCommandTaskComposer {
    public static readonly minAbsSpeed = 10;

    protected handle(
        binding: ControlSchemeBinding,
        inputValue: number,
    ): PortCommandSetLinearSpeedTask | null {
        if (binding.output.operationMode !== HubIoOperationMode.Linear) {
            return null;
        }

        const targetSpeed = Math.round(inputValue * MotorFeature.maxSpeed);
        const minNormalizedSpeed = Math.abs(targetSpeed) < SetSpeedComposer.minAbsSpeed ? 0 : targetSpeed;

        return {
            taskType: PortCommandTaskType.SetSpeed,
            portId: binding.output.portId,
            hubId: binding.output.hubId,
            speed: minNormalizedSpeed,
        };
    }
}
