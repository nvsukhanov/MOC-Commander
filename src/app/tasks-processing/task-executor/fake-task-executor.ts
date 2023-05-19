import { ITaskExecutor } from './i-task-executor';
import { PortCommandExecutionStatus } from '@nvsukhanov/rxpoweredup';
import { ILogger, PortCommandTask } from '../../common';
import { debounceTime, from, Observable, take } from 'rxjs';

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
