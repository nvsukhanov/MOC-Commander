import { TaskSuppressor } from '../task-suppressor';
import { PortCommandTask, PortCommandTaskType } from '@app/shared';

export class StepperTaskSuppressor extends TaskSuppressor {
    protected shouldSuppress(
        currentTask: PortCommandTask,
    ): boolean | null {
        if (currentTask.payload.taskType !== PortCommandTaskType.Stepper) {
            return null;
        }
        return false;
    }
}
