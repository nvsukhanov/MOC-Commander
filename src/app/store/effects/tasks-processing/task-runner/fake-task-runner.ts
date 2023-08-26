import { IHub, PortCommandExecutionStatus } from '@nvsukhanov/rxpoweredup';
import { Observable, debounceTime, from, take } from 'rxjs';
import { Injectable } from '@angular/core';
import { ControlSchemeBindingType } from '@app/shared';

import { PortCommandTask } from '../../../models';
import { ITaskRunner } from './i-task-runner';

@Injectable({ providedIn: 'root' })
export class FakeTaskRunner implements ITaskRunner<ControlSchemeBindingType> {
    constructor(
        private readonly taskExecutionDuration: number,
    ) {
    }

    public runTask(
        hub: IHub,
        task: PortCommandTask,
    ): Observable<PortCommandExecutionStatus> {
        // eslint-disable-next-line no-console
        console.debug('Executing task', JSON.stringify(task));
        return from([ PortCommandExecutionStatus.inProgress, PortCommandExecutionStatus.completed ]).pipe(
            debounceTime(this.taskExecutionDuration / 2),
            take(2)
        );
    }
}
