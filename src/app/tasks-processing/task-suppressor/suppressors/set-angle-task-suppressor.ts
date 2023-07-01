import { TaskSuppressor } from '../task-suppressor';
import { PortCommandTask, PortCommandTaskType } from '@app/shared';

export class SetAngleTaskSuppressor extends TaskSuppressor {
    protected shouldSuppress<T extends PortCommandTask>(
        task: T,
        lastTaskOfKindInQueue?: T
    ): boolean | null {
        if (task.taskType !== PortCommandTaskType.SetAngle) {
            return null;
        }
        if (!lastTaskOfKindInQueue || lastTaskOfKindInQueue.taskType !== PortCommandTaskType.SetAngle) {
            return false;
        }
        return lastTaskOfKindInQueue.angle === task.angle;
    }
}
