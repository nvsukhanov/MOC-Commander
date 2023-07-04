import { IHub, MotorUseProfile, PortCommandExecutionStatus } from '@nvsukhanov/rxpoweredup';
import { Observable } from 'rxjs';

import { TaskExecutor } from '../task-executor';
import { PortCommandStepperTask, PortCommandTaskType } from '@app/shared';

export class StepperExecutor extends TaskExecutor {
    protected handle(
        task: PortCommandStepperTask,
        hub: IHub
    ): Observable<PortCommandExecutionStatus> | null {
        if (task.taskType === PortCommandTaskType.Stepper) {
            return hub.motors.rotateByDegree(
                task.portId,
                task.degree,
                {
                    speed: task.speed,
                    power: task.power,
                    useProfile: MotorUseProfile.dontUseProfiles,
                    endState: task.endState
                }
            );
        }
        return null;
    }
}
