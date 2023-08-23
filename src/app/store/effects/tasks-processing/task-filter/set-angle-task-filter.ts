import { ControlSchemeBindingType } from '@app/shared';

import { PortCommandTask } from '../../../models';

export function setAngleTaskFilter(
    task: PortCommandTask<ControlSchemeBindingType.SetAngle>,
    lastExecutedTask: PortCommandTask | null
): boolean {
    if (!lastExecutedTask || lastExecutedTask.payload.bindingType !== ControlSchemeBindingType.SetAngle) {
        return true;
    }

    return task.payload.angle !== lastExecutedTask.payload.angle;
}
