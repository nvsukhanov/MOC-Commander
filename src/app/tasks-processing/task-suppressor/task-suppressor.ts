import { ITaskSuppressor } from './i-task-suppressor';
import { PortCommandTask } from '../../common';

// Suppressors are used to filter out tasks that should not be sent to the hub.
// i.g. if the task equals to the last task in the queue, then it is not needed.
// Consider the following example:
// last executed task: set speed to 50
// next task: set speed to 51
// The next task is not needed, because the threshold of speed change is 10, so the next task will be suppressed.
// This is done to reduce the number of tasks sent to the hub, effectively reducing time-to-execute and hub battery consumption.
export abstract class TaskSuppressor implements ITaskSuppressor {
    private next?: TaskSuppressor;

    protected abstract shouldSuppress<T extends PortCommandTask>(
        task: T,
        lastTaskOfKindInQueue?: T,
    ): boolean | null;

    public shouldSuppressTask<T extends PortCommandTask>(
        task: T,
        lastTaskOfKindInQueue?: T
    ): boolean {
        // If the source of the task is different from the source of the last task in the queue
        // AND the last task in the queue is not neutral, then we should suppress the task.
        // This is because we don't want to mix commands from different sources (conflicting by nature).
        if (task.bindingId !== lastTaskOfKindInQueue?.bindingId && lastTaskOfKindInQueue?.isNeutral === false) {
            return true;
        }

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
