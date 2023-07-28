import { IHub, PortCommandExecutionStatus } from '@nvsukhanov/rxpoweredup';
import { Observable } from 'rxjs';

import { TaskRunner } from '../task-runner';
import { PortCommandTask, PortCommandTaskType } from '../../../../models';
import { mapUseProfile } from '../map-use-profile';

export class ServoTaskRunner extends TaskRunner {
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
                    useProfile: mapUseProfile(task.payload),
                    noFeedback: false
                }
            );
        }
        return null;
    }

}
