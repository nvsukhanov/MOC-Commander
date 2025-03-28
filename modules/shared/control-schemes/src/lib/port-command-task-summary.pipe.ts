import { Inject, Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs';
import { PortCommandTask } from '@app/store';

import { IPortCommandTaskSummaryBuilder, PORT_COMMAND_TASK_SUMMARY_BUILDER } from './i-port-command-task-summary-builder';

@Pipe({
  standalone: true,
  name: 'portCommandTaskSummary',
  pure: true,
})
export class PortCommandTaskSummaryPipe implements PipeTransform {
  constructor(
    @Inject(PORT_COMMAND_TASK_SUMMARY_BUILDER)
    private readonly portCommandTaskSummaryBuilder: IPortCommandTaskSummaryBuilder,
  ) {}

  public transform(portCommandTask: PortCommandTask): Observable<string> {
    return this.portCommandTaskSummaryBuilder.buildTaskSummary(portCommandTask);
  }
}
