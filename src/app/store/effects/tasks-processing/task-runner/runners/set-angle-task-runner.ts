import { Observable } from 'rxjs';
import { IHub, PortCommandExecutionStatus } from '@nvsukhanov/rxpoweredup';
import { ControlSchemeBindingType } from '@app/shared';

import { TaskRunner } from '../task-runner';
import { PortCommandTask } from '../../../../models';
import { mapUseProfile } from '../map-use-profile';

export class SetAngleTaskRunner extends TaskRunner {
    protected handle(
        task: PortCommandTask,
        hub: IHub
    ): Observable<PortCommandExecutionStatus> | null {
        if (task.payload.bindingType === ControlSchemeBindingType.SetAngle) {
            return hub.motors.goToPosition(
                task.portId,
                task.payload.angle,
                {
                    speed: task.payload.speed,
                    power: task.payload.power,
                    endState: task.payload.endState,
                    useProfile: mapUseProfile(task.payload)
                }
            );
        }
        return null;
    }
}
