import { PortCommandTask, PortCommandTaskType } from '../../../models';

export function setAngleTaskFilter(
    task: PortCommandTask<PortCommandTaskType.SetAngle>,
    lastExecutedTask: PortCommandTask | null
): boolean {
    if (!lastExecutedTask || lastExecutedTask.payload.taskType !== PortCommandTaskType.SetAngle) {
        return true;
    }

    return task.payload.angle !== lastExecutedTask.payload.angle;
}
