import { PortCommandTask, PortCommandTaskType } from '../../../models';

export function setSpeedTaskFilter(
    task: PortCommandTask<PortCommandTaskType.SetSpeed>,
    lastExecutedTask: PortCommandTask | null
): boolean {
    if (!lastExecutedTask || lastExecutedTask.payload.taskType !== PortCommandTaskType.SetSpeed) {
        return task.payload.activeInput;
    }

    return task.hash !== lastExecutedTask.hash;
}
