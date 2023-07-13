import { PortCommandTask } from '@app/shared';
import { ITaskSuppressor } from './i-task-suppressor';

// Suppressors are used to filter out tasks that should not be sent to the hub
export abstract class TaskSuppressor implements ITaskSuppressor {
    private next?: TaskSuppressor;

    protected abstract shouldSuppress(
        currentTask: PortCommandTask,
        lastExecutedTask: PortCommandTask | null
    ): boolean | null;

    public shouldSuppressTask(
        task: PortCommandTask,
        lastExecutedTask: PortCommandTask | null
    ): boolean {
        // we should check if the task should be suppressed by task-specific logic
        // (e.g. we don't want to send redundant SetSpeed commands to the hub, while resending Stepper commands is fine)
        // The same applies to the currently running task (e.g. we don't want to send redundant Stepper commands to the hub
        // until the previous Stepper command has finished executing)
        const result = this.shouldSuppress(
            task,
            lastExecutedTask
        );
        if (result !== null) {
            return result;
        }
        if (this.next) {
            return this.next.shouldSuppressTask(task, lastExecutedTask);
        }
        return true;
    }

    public setNext(next: TaskSuppressor): TaskSuppressor {
        this.next = next;
        return next;
    }
}
