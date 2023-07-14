import { Observable } from 'rxjs';
import { IHub, PortCommandExecutionStatus } from '@nvsukhanov/rxpoweredup';

import { TaskExecutor } from '../task-executor';
import { PortCommandTask, PortCommandTaskType } from '../../../../models';

export class SetAngleExecutor extends TaskExecutor {
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
