import { IHub, PortCommandExecutionStatus } from '@nvsukhanov/rxpoweredup';
import { Observable } from 'rxjs';

import { PortCommandTask } from '@app/shared';

export interface ITaskExecutor {
    executeTask(task: PortCommandTask, hub: IHub): Observable<PortCommandExecutionStatus>;
}
