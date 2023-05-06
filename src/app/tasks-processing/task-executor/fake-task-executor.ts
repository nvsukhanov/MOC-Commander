import { ITaskExecutor } from './i-task-executor';
import { IHub } from '@nvsukhanov/poweredup-api';
import { ILogger, PortCommandTask } from '../../common';

export class FakeTaskExecutor implements ITaskExecutor {
    constructor(
        private readonly taskExecutionDuration: number,
        private readonly logger: ILogger
    ) {
    }

    public executeTask(task: PortCommandTask, hub: IHub): Promise<void> {
        this.logger.debug('Executing task', JSON.stringify(task), 'on hub', hub.properties.advertisingName);
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, this.taskExecutionDuration);
        });
    }
}
