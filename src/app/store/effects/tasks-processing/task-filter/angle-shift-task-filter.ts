import { ControlSchemeBindingType } from '@app/shared';
import { PortCommandTask } from '@app/store';

export function angleShiftTaskFilter(
    task: PortCommandTask<ControlSchemeBindingType.AngleShift>,
    lastExecutedTask: PortCommandTask | null
): boolean {
    if (!lastExecutedTask || lastExecutedTask.payload.bindingType !== ControlSchemeBindingType.AngleShift) {
        return true;
    }

    return task.hash !== lastExecutedTask.hash;
}
