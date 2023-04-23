import { ITaskExecutor } from './i-task-executor';
import { PortCommandTask } from '../task-composer';
import { Hub } from '../../lego-hub';

export abstract class TaskExecutor implements ITaskExecutor {
    private next?: TaskExecutor;

    protected abstract handle(
        task: PortCommandTask,
        hub: Hub
    ): Promise<void> | null;

    public executeTask(
        task: PortCommandTask,
        hub: Hub
    ): Promise<void> {
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
        return Promise.resolve();
    }

    public setNext(next: TaskExecutor): TaskExecutor {
        this.next = next;
        return next;
    }
}
