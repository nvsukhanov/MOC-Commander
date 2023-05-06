import { IHub } from '@nvsukhanov/poweredup-api';
import { PortCommandTask } from '../../common';

export interface ITaskExecutor {
    executeTask(task: PortCommandTask, hub: IHub): Promise<void>;
}
