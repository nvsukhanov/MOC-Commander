import { ControlSchemeBindingType } from '@app/shared';

import { PortCommandTask } from '../../../models';

export function setSpeedTaskFilter(
    task: PortCommandTask<ControlSchemeBindingType.SetSpeed>,
    lastExecutedTask: PortCommandTask | null
): boolean {
    if (!lastExecutedTask || lastExecutedTask.payload.bindingType !== ControlSchemeBindingType.SetSpeed) {
        return true;
    }

    return task.hash !== lastExecutedTask.hash;
}
