import { PortCommandTask, PortCommandTaskType } from '../../../models';

export function setSpeedTaskFilter(
    task: PortCommandTask<PortCommandTaskType.SetSpeed>,
    lastExecutedTask: PortCommandTask | null
): boolean {
    if (!lastExecutedTask || lastExecutedTask.payload.taskType !== PortCommandTaskType.SetSpeed) {
        return task.payload.activeInput;
    }

    if (task.payload.activeInput) {
        return task.payload.speed !== lastExecutedTask.payload.speed;
    }

    // non-active input task can override active input task if task's bindingId is the same (standard speed control behavior, accelerate->decelerate)
    return lastExecutedTask.bindingId === task.bindingId && lastExecutedTask.payload.activeInput && !task.payload.activeInput;
}
