import { ControlSchemeBindingType } from '@app/shared';

import { PortCommandTask } from '../../../models';

export function speedStepperTaskFilter(
    task: PortCommandTask<ControlSchemeBindingType.SpeedStepper>,
    lastExecutedTask: PortCommandTask | null
): boolean {
    if (!lastExecutedTask || lastExecutedTask.payload.bindingType !== ControlSchemeBindingType.SpeedStepper) {
        return true;
    }

    return task.hash !== lastExecutedTask.hash;
}
