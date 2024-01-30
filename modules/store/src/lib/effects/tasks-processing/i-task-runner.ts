import { IHub, PortCommandExecutionStatus } from 'rxpoweredup';
import { Observable } from 'rxjs';
import { InjectionToken } from '@angular/core';

import { PortCommandTask } from '../../models';

export interface ITaskRunner {
    runTask(
        hub: IHub,
        task: PortCommandTask,
    ): Observable<PortCommandExecutionStatus>;
}

export const TASK_RUNNER = new InjectionToken<ITaskRunner>('TASK_RUNNER');
