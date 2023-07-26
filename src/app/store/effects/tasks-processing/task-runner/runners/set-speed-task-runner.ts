import { IHub, PortCommandExecutionStatus } from '@nvsukhanov/rxpoweredup';
import { Observable } from 'rxjs';

import { TaskRunner } from '../task-runner';
import { PortCommandTask, PortCommandTaskType } from '../../../../models';
import { mapUseProfile } from '../map-use-profile';

export class SetSpeedTaskRunner extends TaskRunner {
    protected handle(
        task: PortCommandTask,
        hub: IHub
    ): Observable<PortCommandExecutionStatus> | null {
        if (task.payload.taskType === PortCommandTaskType.SetSpeed) {
            return hub.motors.setSpeed(
                task.portId,
                task.payload.speed,
                {
                    power: task.payload.power,
                    useProfile: mapUseProfile(task.payload),
                    noFeedback: true
                }
            );
        }
        return null;
    }
}
