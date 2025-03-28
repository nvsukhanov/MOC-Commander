import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { PortCommandTask, TaskType } from '@app/store';

import { ITaskSummaryBuilder } from '../i-task-summary-builder';

@Injectable()
export class GearboxTaskL10nService implements ITaskSummaryBuilder<TaskType.Gearbox> {
  constructor(private readonly translocoService: TranslocoService) {}

  public buildTaskSummary(task: PortCommandTask<TaskType.Gearbox>): Observable<string> {
    const level = task.payload.initialLevelIndex - task.payload.angleIndex;
    const angle = task.payload.angle;
    const isLooping = task.payload.isLooping;
    return this.translocoService.selectTranslate('controlScheme.tasks.gearboxSummary', { level, angle, isLooping });
  }
}
