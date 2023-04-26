import { Hub } from '../../lego-hub';
import { PortCommandTask } from '../../common';

export interface ITaskExecutor {
    executeTask(task: PortCommandTask, hub: Hub): Promise<void>;
}
