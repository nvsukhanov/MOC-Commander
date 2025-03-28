import { IHub, PortCommandExecutionStatus } from 'rxpoweredup';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { ITaskRunner, PortCommandTask, TaskType } from '@app/store';

import { mapUseProfile } from '../common/map-use-profile';

@Injectable()
export class TrainTaskRunnerService implements ITaskRunner<TaskType.Train> {
  public runTask(hub: IHub, task: PortCommandTask<TaskType.Train>): Observable<PortCommandExecutionStatus> {
    return hub.motors.startSpeed(task.portId, task.payload.speed, {
      power: task.payload.power,
      useProfile: mapUseProfile(task.payload),
    });
  }
}
