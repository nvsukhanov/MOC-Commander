import { Observable } from 'rxjs';
import { ControlSchemeBindingType } from '@app/shared-misc';
import { PortCommandTask } from '@app/store';

export interface IBindingTaskSummaryBuilder<T extends ControlSchemeBindingType> {
    buildTaskSummary(
        payload: PortCommandTask<T>
    ): Observable<string>;
}
