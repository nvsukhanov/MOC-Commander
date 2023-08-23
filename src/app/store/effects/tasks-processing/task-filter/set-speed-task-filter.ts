import { ControlSchemeBindingType } from '@app/shared';

import { PortCommandTask } from '../../../models';

export function setSpeedTaskFilter(
    task: PortCommandTask<ControlSchemeBindingType.Linear>,
    lastExecutedTask: PortCommandTask | null
): boolean {
    if (!lastExecutedTask || lastExecutedTask.payload.bindingType !== ControlSchemeBindingType.Linear) {
        return task.payload.activeInput;
    }

    return task.hash !== lastExecutedTask.hash;
}
