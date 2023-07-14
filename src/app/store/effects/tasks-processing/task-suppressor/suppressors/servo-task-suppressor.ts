import { TaskSuppressor } from '../task-suppressor';
import { PortCommandTask, PortCommandTaskType } from '../../../../models';

export class ServoTaskSuppressor extends TaskSuppressor {
    private readonly servoThresholdDegrees = 10;

    protected shouldSuppress(
        currentTask: PortCommandTask,
        lastExecutedTask: PortCommandTask | null
    ): boolean | null {
        if (currentTask.payload.taskType !== PortCommandTaskType.Servo) {
            return null;
        }

        // will center the servo if there is no last executed task
        if (!lastExecutedTask) {
            return false;
        }

        // will center the servo if the last executed task was not a servo task
        if (lastExecutedTask.payload.taskType !== PortCommandTaskType.Servo) {
            return false;
        }

        // will snap to center if the last executed task was a servo task and the current task is a servo task with angle 0
        if (lastExecutedTask.payload.angle !== 0 && currentTask.payload.angle === 0) {
            return false;
        }

        // TODO: potentially could suppress if angle is near arc's ends. need fix. Move threshold ops to the task builder?
        return Math.abs(currentTask.payload.angle - lastExecutedTask.payload.angle) < this.servoThresholdDegrees;
    }
}
