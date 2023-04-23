import { PortCommandTask, PortCommandTaskType } from '../../task-composer';
import { TaskSuppressor } from '../task-suppressor';
import { MotorFeature } from '../../../lego-hub/features';

export class SetSpeedTaskSuppressor extends TaskSuppressor {
    public static readonly speedThreshold = 10;

    protected shouldSuppress(
        task: PortCommandTask,
        lastTaskOfKindInQueue: PortCommandTask
    ): boolean | null {
        if (task.taskType !== PortCommandTaskType.SetSpeed) {
            return null;
        }
        if ((Math.abs(task.speed) === MotorFeature.maxSpeed || task.speed === 0) && lastTaskOfKindInQueue.speed !== task.speed) {
            return false;
        }
        return Math.abs(task.speed - lastTaskOfKindInQueue.speed) < SetSpeedTaskSuppressor.speedThreshold;
    }
}
