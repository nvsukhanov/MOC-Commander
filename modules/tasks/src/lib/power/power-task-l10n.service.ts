import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { PortCommandTask, TaskType } from '@app/store';
import { clampSpeed } from '@app/shared-misc';

import { ITaskSummaryBuilder } from '../i-task-summary-builder';

@Injectable()
export class PowerTaskL10nService implements ITaskSummaryBuilder<TaskType.Power> {
  constructor(private readonly translocoService: TranslocoService) {}

  public buildTaskSummary(task: PortCommandTask<TaskType.Power>): Observable<string> {
    const power = clampSpeed(task.payload.power);
    return this.translocoService.selectTranslate('controlScheme.tasks.powerSummary', { power });
  }
}
