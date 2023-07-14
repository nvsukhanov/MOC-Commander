import { ILogger, PortCommandExecutionStatus } from '@nvsukhanov/rxpoweredup';
import { Observable, debounceTime, from, take } from 'rxjs';

import { ITaskExecutor } from './i-task-executor';
import { PortCommandTask } from '../../../models';

export class FakeTaskExecutor implements ITaskExecutor {
    constructor(
        private readonly taskExecutionDuration: number,
        private readonly logger: ILogger
    ) {
    }

    public executeTask(
        task: PortCommandTask,
    ): Observable<PortCommandExecutionStatus> {
        this.logger.debug('Executing task', JSON.stringify(task));
        return from([ PortCommandExecutionStatus.inProgress, PortCommandExecutionStatus.completed ]).pipe(
            debounceTime(this.taskExecutionDuration / 2),
            take(2)
        );
    }
}
