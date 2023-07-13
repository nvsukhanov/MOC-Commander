import { IHub, MotorUseProfile, PortCommandExecutionStatus } from '@nvsukhanov/rxpoweredup';
import { Observable } from 'rxjs';

import { TaskExecutor } from '../task-executor';
import { PortCommandTask, PortCommandTaskType } from '@app/shared';

export class ServoExecutor extends TaskExecutor {
    protected handle(
        task: PortCommandTask,
        hub: IHub
    ): Observable<PortCommandExecutionStatus> | null {
        if (task.payload.taskType === PortCommandTaskType.Servo) {
            return hub.motors.goToPosition(
                task.portId,
                task.payload.angle,
                {
                    speed: task.payload.speed,
                    power: task.payload.power,
                    useProfile: MotorUseProfile.dontUseProfiles
                }
            );
        }
        return null;
    }

}
