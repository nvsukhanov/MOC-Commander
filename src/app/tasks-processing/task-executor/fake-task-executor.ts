import { ITaskExecutor } from './i-task-executor';
import { Hub } from '../../lego-hub';
import { ILogger } from '../../common';
import { PortCommandTask } from '../../types';

export class FakeTaskExecutor implements ITaskExecutor {
    constructor(
        private readonly taskExecutionDuration: number,
        private readonly logger: ILogger
    ) {
    }

    public executeTask(task: PortCommandTask, hub: Hub): Promise<void> {
        this.logger.debug('Executing task', JSON.stringify(task), 'on hub', hub.name);
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, this.taskExecutionDuration);
        });
    }
}
