import { Observable } from 'rxjs';
import { IHub, PortCommandExecutionStatus } from '@nvsukhanov/rxpoweredup';

import { TaskExecutor } from '../task-executor';
import { PortCommandSetAngle, PortCommandTaskType } from '@app/shared';

export class SetAngleExecutor extends TaskExecutor {
    protected handle(
        task: PortCommandSetAngle,
        hub: IHub
    ): Observable<PortCommandExecutionStatus> | null {
        if (task.taskType === PortCommandTaskType.SetAngle) {
            return hub.motors.goToPosition(
                task.portId,
                task.angle,
                {
                    speed: task.speed,
                    power: task.power,
                    endState: task.endState,
                }
            );
        }
        return null;
    }
}
