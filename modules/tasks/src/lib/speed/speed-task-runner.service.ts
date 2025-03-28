import { IHub, PortCommandExecutionStatus } from 'rxpoweredup';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { calculateSpeedPower } from '@app/shared-misc';
import { ITaskRunner, PortCommandTask, TaskType } from '@app/store';

import { mapUseProfile } from '../common/map-use-profile';

@Injectable()
export class SpeedTaskRunnerService implements ITaskRunner<TaskType.Speed> {
  public runTask(hub: IHub, task: PortCommandTask<TaskType.Speed>): Observable<PortCommandExecutionStatus> {
    const { speed, power } = calculateSpeedPower(task.payload.speed, task.payload.brakeFactor, task.payload.power);
    return hub.motors.startSpeed(task.portId, speed, {
      power,
      useProfile: mapUseProfile(task.payload),
    });
  }
}
