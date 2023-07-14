import { IHub, PortCommandExecutionStatus } from '@nvsukhanov/rxpoweredup';
import { Observable } from 'rxjs';
import { InjectionToken } from '@angular/core';

import { PortCommandTask } from '../../models';
import { taskRunnerFactory } from './task-runner';

export interface ITaskRunner {
    runTask(task: PortCommandTask, hub: IHub): Observable<PortCommandExecutionStatus>;
}

export const TASK_RUNNER = new InjectionToken<ITaskRunner>('TASK RUNNER', { factory: taskRunnerFactory });
