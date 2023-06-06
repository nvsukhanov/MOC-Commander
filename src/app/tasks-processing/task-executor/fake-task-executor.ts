import { PortCommandExecutionStatus } from '@nvsukhanov/rxpoweredup';
import { Observable, debounceTime, from, take } from 'rxjs';

import { ILogger, PortCommandTask } from '@app/shared';
import { ITaskExecutor } from './i-task-executor';

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
