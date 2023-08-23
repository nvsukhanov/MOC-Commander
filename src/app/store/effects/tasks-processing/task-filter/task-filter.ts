import { ControlSchemeBindingType } from '@app/shared';

import { PortCommandTask } from '../../../models';
import { setSpeedTaskFilter } from './set-speed-task-filter';
import { servoTaskFilter } from './servo-task-filter';
import { setAngleTaskFilter } from './set-angle-task-filter';
import { speedStepperTaskFilter } from './speed-stepper-task-filter';

export function taskFilter(
    task: PortCommandTask,
    lastExecutedTask: PortCommandTask | null
): boolean {
    switch (task.payload.bindingType) {
        case ControlSchemeBindingType.Linear:
            return setSpeedTaskFilter(task as PortCommandTask<ControlSchemeBindingType.Linear>, lastExecutedTask);
        case ControlSchemeBindingType.Servo:
            return servoTaskFilter(task as PortCommandTask<ControlSchemeBindingType.Servo>, lastExecutedTask);
        case ControlSchemeBindingType.SetAngle:
            return setAngleTaskFilter(task as PortCommandTask<ControlSchemeBindingType.SetAngle>, lastExecutedTask);
        case ControlSchemeBindingType.SpeedStepper:
            return speedStepperTaskFilter(task as PortCommandTask<ControlSchemeBindingType.SpeedStepper>, lastExecutedTask);
        default:
            return true;
    }
}
