import { IHub, PortCommandExecutionStatus } from 'rxpoweredup';
import { Observable } from 'rxjs';
import { InjectionToken } from '@angular/core';

import { PortCommandTask, TaskType } from '../../models';

export interface ITaskRunner<TTaskType extends TaskType = TaskType> {
  runTask(hub: IHub, task: PortCommandTask<TTaskType>): Observable<PortCommandExecutionStatus>;
}

export const TASK_RUNNER = new InjectionToken<ITaskRunner>('TASK_RUNNER');
