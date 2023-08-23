import { PortCommandTask, PortCommandTaskType } from '@app/store';

export function speedStepperTaskFilter(
    task: PortCommandTask<PortCommandTaskType.SpeedStepper>,
    lastExecutedTask: PortCommandTask | null
): boolean {
    if (!lastExecutedTask || lastExecutedTask.payload.taskType !== PortCommandTaskType.SpeedStepper) {
        return true;
    }

    return task.hash !== lastExecutedTask.hash;
}
