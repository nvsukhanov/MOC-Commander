import { PortCommandTaskComposer } from '../port-command-task-composer';
import { ControlSchemeBinding, PortCommandTaskType, SetAngleTaskPayload } from '../../../../models';
import { HubIoOperationMode } from '@app/shared';

export class SetAngleComposer extends PortCommandTaskComposer<SetAngleTaskPayload> {
    private readonly inputValueThreshold = 0.5;

    protected composePayload(
        binding: ControlSchemeBinding,
        inputValue: number
    ): SetAngleTaskPayload | null {
        const outputConfig = binding.output;
        if (outputConfig.operationMode !== HubIoOperationMode.SetAngle) {
            return null;
        }
        if (inputValue < this.inputValueThreshold) {
            return null;
        }
        return {
            taskType: PortCommandTaskType.SetAngle,
            angle: outputConfig.setAngleConfig.angle,
            speed: outputConfig.setAngleConfig.speed,
            power: outputConfig.setAngleConfig.power,
            endState: outputConfig.setAngleConfig.endState,
        };
    }

    protected calculatePayloadHash(
        payload: SetAngleTaskPayload
    ): string {
        return [
            payload.angle,
            payload.speed,
            payload.power,
            payload.endState
        ].join('_');
    }
}
