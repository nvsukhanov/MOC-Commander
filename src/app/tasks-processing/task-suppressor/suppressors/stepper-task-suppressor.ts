import { TaskSuppressor } from '../task-suppressor';
import { PortCommandTask, PortCommandTaskType } from '@app/shared';

export class StepperTaskSuppressor extends TaskSuppressor {
    protected shouldSuppress<T extends PortCommandTask>(
        task: T,
    ): boolean | null {
        if (task.taskType !== PortCommandTaskType.Stepper) {
            return null;
        }
        return false;
    }
}
