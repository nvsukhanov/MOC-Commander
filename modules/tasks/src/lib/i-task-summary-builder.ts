import { Observable } from 'rxjs';
import { PortCommandTask, TaskType } from '@app/store';

export interface ITaskSummaryBuilder<TTaskType extends TaskType> {
  buildTaskSummary(task: PortCommandTask<TTaskType>): Observable<string>;
}
