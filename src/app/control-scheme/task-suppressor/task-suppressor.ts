import { ITaskSuppressor } from './i-task-suppressor';
import { PortCommandTask } from '../task-composer';

export abstract class TaskSuppressor implements ITaskSuppressor {
    private next?: TaskSuppressor;

    protected abstract shouldSuppress<T extends PortCommandTask>(
        task: T,
        lastTaskOfKindInQueue: T,
    ): boolean | null;

    public shouldSuppressTask<T extends PortCommandTask>(
        task: T,
        lastTaskOfKindInQueue: T
    ): boolean {
        const result = this.shouldSuppress(task, lastTaskOfKindInQueue);
        if (result !== null) {
            return result;
        }
        if (this.next) {
            return this.next.shouldSuppressTask(task, lastTaskOfKindInQueue);
        }
        return true;
    }

    public setNext(next: TaskSuppressor): TaskSuppressor {
        this.next = next;
        return next;
    }
}
