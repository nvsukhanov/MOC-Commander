import { TaskExecutor } from '../task-executor';
import { Hub } from '../../../lego-hub';
import { PortCommandTask } from '../../../common';

export class SetSpeedExecutor extends TaskExecutor {
    protected handle(
        task: PortCommandTask,
        hub: Hub
    ): Promise<void> | null {
        return hub.motor.setSpeed(task.portId, task.speed, task.power);
    }
}
