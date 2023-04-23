import { PortCommandTask } from '../task-composer';
import { Hub } from '../../lego-hub';

export interface ITaskExecutor {
    executeTask(task: PortCommandTask, hub: Hub): Promise<void>;
}
