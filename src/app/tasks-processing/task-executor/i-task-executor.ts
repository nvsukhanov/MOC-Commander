import { IHub, PortCommandExecutionStatus } from '@nvsukhanov/rxpoweredup';
import { Observable } from 'rxjs';

import { PortCommandTask } from '../../common';

export interface ITaskExecutor {
    executeTask(task: PortCommandTask, hub: IHub): Observable<PortCommandExecutionStatus>;
}
