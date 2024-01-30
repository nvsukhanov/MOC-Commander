import { Observable } from 'rxjs';
import { InjectionToken } from '@angular/core';
import { PortCommandTask } from '@app/store';

export interface IPortCommandTaskSummaryBuilder {
    buildTaskSummary(
        portCommandTask: PortCommandTask
    ): Observable<string>;
}

export const PORT_COMMAND_TASK_SUMMARY_BUILDER = new InjectionToken<IPortCommandTaskSummaryBuilder>('IPortCommandTaskSummaryBuilder');
