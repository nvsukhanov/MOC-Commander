import { IHub, PortCommandExecutionStatus } from '@nvsukhanov/rxpoweredup';
import { Observable, of } from 'rxjs';

import { ITaskExecutor } from './i-task-executor';
import { PortCommandTask } from '../../common';


export abstract class TaskExecutor implements ITaskExecutor {
    private next?: TaskExecutor;

    protected abstract handle(
        task: PortCommandTask,
        hub: IHub
    ): Observable<PortCommandExecutionStatus> | null;

    public executeTask(
        task: PortCommandTask,
        hub: IHub
    ): Observable<PortCommandExecutionStatus> {
        const result = this.handle(
            task,
            hub
        );
        if (result) {
            return result;
        }
        if (this.next) {
            return this.next.executeTask(task, hub);
        }
        return of(PortCommandExecutionStatus.discarded);
    }

    public setNext(next: TaskExecutor): TaskExecutor {
        this.next = next;
        return next;
    }
}
