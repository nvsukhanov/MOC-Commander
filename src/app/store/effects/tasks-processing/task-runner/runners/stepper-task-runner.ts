import { IHub, MotorUseProfile, PortCommandExecutionStatus } from '@nvsukhanov/rxpoweredup';
import { Observable, last } from 'rxjs';

import { TaskRunner } from '../task-runner';
import { PortCommandTask, PortCommandTaskType } from '../../../../models';

export class StepperTaskRunner extends TaskRunner {
    protected handle(
        task: PortCommandTask,
        hub: IHub
    ): Observable<PortCommandExecutionStatus> | null {
        if (task.payload.taskType === PortCommandTaskType.Stepper) {
            return hub.motors.rotateByDegree(
                task.portId,
                task.payload.degree,
                {
                    speed: task.payload.speed,
                    power: task.payload.power,
                    useProfile: MotorUseProfile.dontUseProfiles,
                    endState: task.payload.endState
                }
            ).pipe(
                last()
            );
        }
        return null;
    }
}
