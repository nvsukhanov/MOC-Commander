import { ControlSchemeBindingType } from '@app/shared';

import { PortCommandTask } from '../../../models';
import { setSpeedTaskFilter } from './set-speed-task-filter';
import { servoTaskFilter } from './servo-task-filter';
import { setAngleTaskFilter } from './set-angle-task-filter';
import { angleShiftTaskFilter } from './angle-shift-task-filter';
import { speedShiftTaskFilter } from './speed-shift-task-filter';

export function taskFilter(
    task: PortCommandTask,
    lastExecutedTask: PortCommandTask | null
): boolean {
    switch (task.payload.bindingType) {
        case ControlSchemeBindingType.SetSpeed:
            return setSpeedTaskFilter(task as PortCommandTask<ControlSchemeBindingType.SetSpeed>, lastExecutedTask);
        case ControlSchemeBindingType.Servo:
            return servoTaskFilter(task as PortCommandTask<ControlSchemeBindingType.Servo>, lastExecutedTask);
        case ControlSchemeBindingType.SetAngle:
            return setAngleTaskFilter(task as PortCommandTask<ControlSchemeBindingType.SetAngle>, lastExecutedTask);
        case ControlSchemeBindingType.SpeedShift:
            return speedShiftTaskFilter(task as PortCommandTask<ControlSchemeBindingType.SpeedShift>, lastExecutedTask);
        case ControlSchemeBindingType.Stepper:
            return true;
        case ControlSchemeBindingType.AngleShift:
            return angleShiftTaskFilter(task as PortCommandTask<ControlSchemeBindingType.AngleShift>, lastExecutedTask);
    }
}
