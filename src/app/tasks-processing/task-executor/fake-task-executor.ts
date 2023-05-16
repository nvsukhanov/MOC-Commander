import { ITaskExecutor } from './i-task-executor';
import { PortCommandExecutionStatus } from '@nvsukhanov/poweredup-api';
import { ILogger, PortCommandTask } from '../../common';
import { debounceTime, from, Observable } from 'rxjs';

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
        return from([ PortCommandExecutionStatus.InProgress, PortCommandExecutionStatus.Completed ]).pipe(
            debounceTime(this.taskExecutionDuration / 2)
        );
    }
}
