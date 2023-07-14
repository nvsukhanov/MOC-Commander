import { ILogger, PortCommandExecutionStatus } from '@nvsukhanov/rxpoweredup';
import { Observable, debounceTime, from, take } from 'rxjs';

import { ITaskRunner } from './i-task-runner';
import { PortCommandTask } from '../../../models';

export class FakeTaskRunner implements ITaskRunner {
    constructor(
        private readonly taskExecutionDuration: number,
        private readonly logger: ILogger
    ) {
    }

    public runTask(
        task: PortCommandTask,
    ): Observable<PortCommandExecutionStatus> {
        this.logger.debug('Executing task', JSON.stringify(task));
        return from([ PortCommandExecutionStatus.inProgress, PortCommandExecutionStatus.completed ]).pipe(
            debounceTime(this.taskExecutionDuration / 2),
            take(2)
        );
    }
}
