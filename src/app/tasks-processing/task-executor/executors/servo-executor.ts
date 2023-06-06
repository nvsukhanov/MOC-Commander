import { IHub, MotorUseProfile, PortCommandExecutionStatus } from '@nvsukhanov/rxpoweredup';
import { Observable } from 'rxjs';

import { PortCommandTask, PortCommandTaskType } from '@app/shared';
import { TaskExecutor } from '../task-executor';

export class ServoExecutor extends TaskExecutor {
    protected handle(
        task: PortCommandTask,
        hub: IHub
    ): Observable<PortCommandExecutionStatus> | null {
        if (task.taskType === PortCommandTaskType.Servo) {
            return hub.motors.goToPosition(
                task.portId,
                task.angle,
                {
                    speed: task.speed,
                    power: task.power,
                    useProfile: MotorUseProfile.dontUseProfiles
                }
            );
        }
        return null;
    }

}
