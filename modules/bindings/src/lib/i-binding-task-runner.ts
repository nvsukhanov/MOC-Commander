import { IHub, PortCommandExecutionStatus } from 'rxpoweredup';
import { Observable } from 'rxjs';
import { ControlSchemeBindingType } from '@app/shared-misc';
import { PortCommandTask } from '@app/store';

export interface IBindingTaskRunner<TType extends ControlSchemeBindingType> {
    runTask(
        hub: IHub,
        task: PortCommandTask<TType>,
    ): Observable<PortCommandExecutionStatus>;
}
