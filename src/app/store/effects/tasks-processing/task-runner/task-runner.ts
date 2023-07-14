import { IHub, PortCommandExecutionStatus } from '@nvsukhanov/rxpoweredup';
import { Observable, of } from 'rxjs';

import { ITaskRunner } from '../i-task-runner';
import { PortCommandTask } from '../../../models';

export abstract class TaskRunner implements ITaskRunner {
    private next?: TaskRunner;

    protected abstract handle(
        task: PortCommandTask,
        hub: IHub
    ): Observable<PortCommandExecutionStatus> | null;

    public runTask(
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
            return this.next.runTask(task, hub);
        }
        return of(PortCommandExecutionStatus.discarded);
    }

    public setNext(next: TaskRunner): TaskRunner {
        this.next = next;
        return next;
    }
}
