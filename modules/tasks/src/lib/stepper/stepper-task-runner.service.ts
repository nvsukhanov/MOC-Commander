import { IHub, PortCommandExecutionStatus } from 'rxpoweredup';
import { Observable, last } from 'rxjs';
import { Injectable } from '@angular/core';
import { ITaskRunner, PortCommandTask, StepperBindingInputAction, TaskType } from '@app/store';

import { mapUseProfile } from '../common/map-use-profile';

@Injectable()
export class StepperTaskRunnerService implements ITaskRunner<TaskType.Stepper> {
    public runTask(
        hub: IHub,
        task: PortCommandTask<TaskType.Stepper>,
    ): Observable<PortCommandExecutionStatus> {
        return hub.motors.rotateByDegree(
            task.portId,
            task.payload.degree * (task.payload.action === StepperBindingInputAction.Cw ? 1 : -1),
            {
                speed: task.payload.speed,
                power: task.payload.power,
                useProfile: mapUseProfile(task.payload),
                endState: task.payload.endState
            }
        ).pipe(
            last()
        );
    }
}
