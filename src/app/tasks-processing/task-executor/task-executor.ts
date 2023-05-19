import { ITaskExecutor } from './i-task-executor';
import { IHub, PortCommandExecutionStatus } from '@nvsukhanov/rxpoweredup';
import { PortCommandTask } from '../../common';
import { Observable, of } from 'rxjs';

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
