import { TaskSuppressor } from '../task-suppressor';
import { PortCommandTask, PortCommandTaskType } from '../../../common';
import { MOTOR_LIMITS } from '@nvsukhanov/poweredup-api';

export class SetSpeedTaskSuppressor extends TaskSuppressor {
    public static readonly speedThreshold = 10;

    protected shouldSuppress(
        task: PortCommandTask,
        lastTaskOfKindInQueue: PortCommandTask
    ): boolean | null {
        if (task.taskType !== PortCommandTaskType.SetSpeed) {
            return null;
        }
        if ((Math.abs(task.speed) === MOTOR_LIMITS.maxSpeed || task.speed === 0) && lastTaskOfKindInQueue.speed !== task.speed) {
            return false;
        }
        return Math.abs(task.speed - lastTaskOfKindInQueue.speed) < SetSpeedTaskSuppressor.speedThreshold;
    }
}
