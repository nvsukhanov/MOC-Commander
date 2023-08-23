import { ControlSchemeBindingType } from '@app/shared';

import { PortCommandTask } from '../../../models';

const SERVO_DEGREES_THRESHOLD = 10;

export function servoTaskFilter(
    task: PortCommandTask<ControlSchemeBindingType.Servo>,
    lastExecutedTask: PortCommandTask | null
): boolean {
    if (!lastExecutedTask || lastExecutedTask.payload.bindingType !== ControlSchemeBindingType.Servo) {
        return true;
    }

    // will snap to center if the last executed task was a servo task and the current task is a servo task with angle 0
    if (lastExecutedTask.payload.angle !== 0 && task.payload.angle === 0) {
        return true;
    }

    // TODO: potentially could suppress if angle is near arc's ends. need fix. Move threshold ops to the task composer?
    return Math.abs(task.payload.angle - lastExecutedTask.payload.angle) > SERVO_DEGREES_THRESHOLD;
}
