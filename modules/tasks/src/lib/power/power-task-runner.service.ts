import { IHub, PortCommandExecutionStatus } from 'rxpoweredup';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { clampSpeed } from '@app/shared-misc';
import { ITaskRunner, PortCommandTask, TaskType } from '@app/store';

@Injectable()
export class PowerTaskRunnerService implements ITaskRunner<TaskType.Power> {
  public runTask(hub: IHub, task: PortCommandTask<TaskType.Power>): Observable<PortCommandExecutionStatus> {
    const power = clampSpeed(task.payload.power);
    return hub.motors.startPower(task.portId, power, task.payload.modeId);
  }
}
