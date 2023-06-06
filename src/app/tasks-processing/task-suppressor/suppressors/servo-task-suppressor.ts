import { TaskSuppressor } from '../task-suppressor';
import { PortCommandTask, PortCommandTaskType } from '../../../common';

export class ServoTaskSuppressor extends TaskSuppressor {
    private readonly servoThresholdDegrees = 10;

    protected shouldSuppress<T extends PortCommandTask>(
        task: T,
        lastTaskOfKindInQueue?: T
    ): boolean | null {
        if (task.taskType !== PortCommandTaskType.Servo) {
            return null;
        }
        if (!lastTaskOfKindInQueue || lastTaskOfKindInQueue.taskType !== PortCommandTaskType.Servo) {
            return false;
        }

        if (lastTaskOfKindInQueue.angle !== 0 && task.angle === 0) {
            return false;
        }

        // TODO: potentially could suppress if angle is near arc's ends. need fix
        return Math.abs(task.angle - lastTaskOfKindInQueue.angle) < this.servoThresholdDegrees;
    }
}
