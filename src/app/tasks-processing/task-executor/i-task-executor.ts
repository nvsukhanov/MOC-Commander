import { Hub } from '@nvsukhanov/poweredup-api';
import { PortCommandTask } from '../../common';

export interface ITaskExecutor {
    executeTask(task: PortCommandTask, hub: Hub): Promise<void>;
}
