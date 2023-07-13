import { TaskSuppressor } from '../task-suppressor';
import { PortCommandTask, PortCommandTaskType } from '@app/shared';

export class SetAngleTaskSuppressor extends TaskSuppressor {
    protected shouldSuppress(
        currentTask: PortCommandTask,
        lastExecutedTask: PortCommandTask | null
    ): boolean | null {
        if (currentTask.payload.taskType !== PortCommandTaskType.SetAngle) {
            return null;
        }

        if (!lastExecutedTask || lastExecutedTask.payload.taskType !== PortCommandTaskType.SetAngle) {
            return false;
        }

        return lastExecutedTask.payload.angle === currentTask.payload.angle;
    }
}
