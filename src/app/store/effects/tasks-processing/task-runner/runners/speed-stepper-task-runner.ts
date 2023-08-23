import { IHub, PortCommandExecutionStatus } from '@nvsukhanov/rxpoweredup';
import { Observable } from 'rxjs';
import { PortCommandTask, PortCommandTaskType } from '@app/store';

import { TaskRunner } from '../task-runner';
import { mapUseProfile } from '../map-use-profile';

export class SpeedStepperTaskRunner extends TaskRunner {
    protected handle(
        task: PortCommandTask,
        hub: IHub
    ): Observable<PortCommandExecutionStatus> | null {
        if (task.payload.taskType === PortCommandTaskType.SpeedStepper) {
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
