import { TaskExecutor } from '../task-executor';
import { IHub, MotorUseProfile, PortCommandExecutionStatus } from '@nvsukhanov/rxpoweredup';
import { PortCommandTask, PortCommandTaskType } from '../../../common';
import { Observable } from 'rxjs';

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
                    useProfile: MotorUseProfile.dontUseProfiles
                }
            );
        }
        return null;
    }
}
