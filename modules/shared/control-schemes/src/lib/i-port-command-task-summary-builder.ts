import { Observable } from 'rxjs';
import { InjectionToken } from '@angular/core';
import { PortCommandTask, TaskType } from '@app/store';

export interface IPortCommandTaskSummaryBuilder<TTaskType extends TaskType = TaskType> {
  buildTaskSummary(portCommandTask: PortCommandTask<TTaskType>): Observable<string>;
}

export const PORT_COMMAND_TASK_SUMMARY_BUILDER = new InjectionToken<IPortCommandTaskSummaryBuilder>('IPortCommandTaskSummaryBuilder');
