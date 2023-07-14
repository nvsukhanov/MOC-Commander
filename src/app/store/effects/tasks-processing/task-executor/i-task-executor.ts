import { IHub, PortCommandExecutionStatus } from '@nvsukhanov/rxpoweredup';
import { Observable } from 'rxjs';

import { PortCommandTask } from '../../../models';

export interface ITaskExecutor {
    executeTask(task: PortCommandTask, hub: IHub): Observable<PortCommandExecutionStatus>;
}
