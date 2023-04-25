import { Hub } from '../../lego-hub';
import { PortCommandTask } from '../../types';

export interface ITaskExecutor {
    executeTask(task: PortCommandTask, hub: Hub): Promise<void>;
}
