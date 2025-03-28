import { Observable } from 'rxjs';
import { IHub, PortCommandExecutionStatus } from 'rxpoweredup';
import { Injectable } from '@angular/core';
import { ITaskRunner, PortCommandTask, TaskType } from '@app/store';

import { mapUseProfile } from '../common/map-use-profile';

@Injectable()
export class SetAngleTaskRunnerService implements ITaskRunner<TaskType.SetAngle> {
  public runTask(hub: IHub, task: PortCommandTask<TaskType.SetAngle>): Observable<PortCommandExecutionStatus> {
    return hub.motors.goToPosition(task.portId, task.payload.angle, {
      speed: task.payload.speed,
      power: task.payload.power,
      endState: task.payload.endState,
      useProfile: mapUseProfile(task.payload),
    });
  }
}
