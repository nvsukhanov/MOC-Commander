import { Observable } from 'rxjs';
import { IHub, PortCommandExecutionStatus } from '@nvsukhanov/rxpoweredup';

import { TaskRunner } from '../task-runner';
import { PortCommandTask, PortCommandTaskType } from '../../../../models';

export class SetAngleTaskRunner extends TaskRunner {
    protected handle(
        task: PortCommandTask,
        hub: IHub
    ): Observable<PortCommandExecutionStatus> | null {
        if (task.payload.taskType === PortCommandTaskType.SetAngle) {
            return hub.motors.goToPosition(
                task.portId,
                task.payload.angle,
                {
                    speed: task.payload.speed,
                    power: task.payload.power,
                    endState: task.payload.endState,
                }
            );
        }
        return null;
    }
}
