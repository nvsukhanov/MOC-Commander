import { PortCommandTask, PortCommandTaskType } from '../../../models';
import { setSpeedTaskFilter } from './set-speed-task-filter';
import { servoTaskFilter } from './servo-task-filter';
import { setAngleTaskFilter } from './set-angle-task-filter';
import { speedStepperTaskFilter } from './speed-stepper-task-filter';

export function taskFilter(
    task: PortCommandTask,
    lastExecutedTask: PortCommandTask | null
): boolean {
    switch (task.payload.taskType) {
        case PortCommandTaskType.SetSpeed:
            return setSpeedTaskFilter(task as PortCommandTask<PortCommandTaskType.SetSpeed>, lastExecutedTask);
        case PortCommandTaskType.Servo:
            return servoTaskFilter(task as PortCommandTask<PortCommandTaskType.Servo>, lastExecutedTask);
        case PortCommandTaskType.SetAngle:
            return setAngleTaskFilter(task as PortCommandTask<PortCommandTaskType.SetAngle>, lastExecutedTask);
        case PortCommandTaskType.SpeedStepper:
            return speedStepperTaskFilter(task as PortCommandTask<PortCommandTaskType.SpeedStepper>, lastExecutedTask);
        default:
            return true;
    }
}
