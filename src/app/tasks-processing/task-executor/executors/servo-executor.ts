import { TaskExecutor } from '../task-executor';
import { PortCommandTask, PortCommandTaskType } from '../../../common';
import { IHub, MotorUseProfile, PortCommandExecutionStatus } from '@nvsukhanov/rxpoweredup';
import { Observable } from 'rxjs';

export class ServoExecutor extends TaskExecutor {
    protected handle(
        task: PortCommandTask,
        hub: IHub
    ): Observable<PortCommandExecutionStatus> | null {
        if (task.taskType === PortCommandTaskType.Servo) {
            return hub.commands.goToAbsoluteDegree(
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
