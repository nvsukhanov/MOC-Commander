import { Observable, filter, switchMap } from 'rxjs';
import { Injectable } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { Store } from '@ngrx/store';
import { ATTACHED_IO_PROPS_SELECTORS, AttachedIoPropsModel, PortCommandTask, TaskType } from '@app/store';

import { ITaskSummaryBuilder } from '../i-task-summary-builder';

@Injectable()
export class SetAngleTaskL10nService implements ITaskSummaryBuilder<TaskType.SetAngle> {
  constructor(
    private readonly translocoService: TranslocoService,
    private readonly store: Store,
  ) {}

  public buildTaskSummary(task: PortCommandTask<TaskType.SetAngle>): Observable<string> {
    return this.store.select(ATTACHED_IO_PROPS_SELECTORS.selectById(task)).pipe(
      filter((ioProps): ioProps is AttachedIoPropsModel => !!ioProps),
      switchMap((ioProps: AttachedIoPropsModel) => {
        const angle = (ioProps.motorEncoderOffset ?? 0) + task.payload.angle;
        return this.translocoService.selectTranslate('controlScheme.tasks.setAngleSummary', { angle });
      }),
    );
  }
}
