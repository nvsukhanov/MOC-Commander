import { IHub, PortCommandExecutionStatus } from 'rxpoweredup';
import { Observable } from 'rxjs';
import { ControlSchemeBindingType } from '@app/shared';

import { PortCommandTask } from '../../../models';

export interface ITaskRunner<TType extends ControlSchemeBindingType> {
    runTask(
        hub: IHub,
        task: PortCommandTask<TType>,
        previousTask?: PortCommandTask,
    ): Observable<PortCommandExecutionStatus>;
}
