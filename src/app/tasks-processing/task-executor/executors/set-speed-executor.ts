import { IHub, MotorUseProfile, PortCommandExecutionStatus } from '@nvsukhanov/rxpoweredup';
import { Observable } from 'rxjs';

import { TaskExecutor } from '../task-executor';
import { PortCommandTask, PortCommandTaskType } from '@app/shared';

export class SetSpeedExecutor extends TaskExecutor {
    protected handle(
        task: PortCommandTask,
        hub: IHub
    ): Observable<PortCommandExecutionStatus> | null {
        if (task.taskType === PortCommandTaskType.SetSpeed) {
            return hub.motors.setSpeed(
                task.portId,
                task.speed,
                {
                    power: task.power,
                    useProfile: MotorUseProfile.dontUseProfiles,
                    noFeedback: true
                }
            );
        }
        return null;
    }
}
