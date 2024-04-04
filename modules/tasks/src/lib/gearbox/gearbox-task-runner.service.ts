import { Injectable } from '@angular/core';
import { IHub, PortCommandExecutionStatus } from 'rxpoweredup';
import { Observable, first } from 'rxjs';
import { ITaskRunner, PortCommandTask, TaskType } from '@app/store';

import { mapUseProfile } from '../common/map-use-profile';

@Injectable()
export class GearboxTaskRunnerService implements ITaskRunner<TaskType.Gearbox> {
    public runTask(
        hub: IHub,
        task: PortCommandTask<TaskType.Gearbox>
    ): Observable<PortCommandExecutionStatus> {
        return hub.motors.goToPosition(
            task.portId,
            task.payload.angle - task.payload.offset,
            {
                speed: task.payload.speed,
                power: task.payload.power,
                endState: task.payload.endState,
                useProfile: mapUseProfile(task.payload)
            }
        ).pipe(
            first()
        );
    }
}
