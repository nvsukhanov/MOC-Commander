import { PortCommandExecutionStatus } from '@nvsukhanov/rxpoweredup';
import { Observable, debounceTime, from, take } from 'rxjs';

import { ITaskRunner } from '../i-task-runner';
import { PortCommandTask } from '../../../models';

export class FakeTaskRunner implements ITaskRunner {
    constructor(
        private readonly taskExecutionDuration: number,
    ) {
    }

    public runTask(
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
