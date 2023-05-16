import { IHub, PortCommandExecutionStatus } from '@nvsukhanov/poweredup-api';
import { PortCommandTask } from '../../common';
import { Observable } from 'rxjs';

export interface ITaskExecutor {
    executeTask(task: PortCommandTask, hub: IHub): Observable<PortCommandExecutionStatus>;
}
