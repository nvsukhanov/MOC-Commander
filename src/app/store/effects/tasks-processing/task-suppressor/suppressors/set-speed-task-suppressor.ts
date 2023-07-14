import { TaskSuppressor } from '../task-suppressor';
import { PortCommandTask, PortCommandTaskType } from '@app/shared';

export class SetSpeedTaskSuppressor extends TaskSuppressor {
    protected shouldSuppress(
        currentTask: PortCommandTask,
        lastExecutedTask: PortCommandTask | null
    ): boolean | null {
        if (currentTask.payload.taskType !== PortCommandTaskType.SetSpeed) {
            return null;
        }

        if (!lastExecutedTask || lastExecutedTask.payload.taskType !== PortCommandTaskType.SetSpeed) {
            return !currentTask.payload.activeInput;
        }

        if (currentTask.payload.activeInput) {
            return this.isSpeedParametersNotChanged(currentTask, lastExecutedTask);
        }

        return !(lastExecutedTask.bindingId === currentTask.bindingId && lastExecutedTask.payload.activeInput && !currentTask.payload.activeInput);

    }

    private isSpeedParametersNotChanged(
        currentTask: PortCommandTask,
        lastExecutedTask: PortCommandTask
    ): boolean {
        return currentTask.payload.speed === lastExecutedTask.payload.speed;
    }
}
