import { ControlSchemeBindingType } from '@app/shared';

import { PortCommandTask } from '../../../models';

export function speedShiftTaskFilter(
    task: PortCommandTask<ControlSchemeBindingType.SpeedShift>,
    lastExecutedTask: PortCommandTask | null
): boolean {
    if (!lastExecutedTask || lastExecutedTask.payload.bindingType !== ControlSchemeBindingType.SpeedShift) {
        return true;
    }

    return task.hash !== lastExecutedTask.hash;
}
