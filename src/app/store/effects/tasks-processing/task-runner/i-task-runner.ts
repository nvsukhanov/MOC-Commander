import { IHub, PortCommandExecutionStatus } from '@nvsukhanov/rxpoweredup';
import { Observable } from 'rxjs';

import { PortCommandTask } from '../../../models';

export interface ITaskRunner {
    runTask(task: PortCommandTask, hub: IHub): Observable<PortCommandExecutionStatus>;
}
