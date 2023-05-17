import { TaskSuppressor } from '../task-suppressor';
import { PortCommandTask, PortCommandTaskType } from '../../../common';

export class ServoTaskSuppressor extends TaskSuppressor {

    protected shouldSuppress<T extends PortCommandTask>(
        task: T,
        lastTaskOfKindInQueue: T
    ): boolean | null {
        if (task.taskType !== PortCommandTaskType.Servo) {
            return null;
        }
        if (lastTaskOfKindInQueue.taskType !== PortCommandTaskType.Servo) {
            return false;
        }

        if (lastTaskOfKindInQueue.angle !== 0 && task.angle === 0) {
            return false;
        }

        return task.angle === lastTaskOfKindInQueue.angle;
    }
}
