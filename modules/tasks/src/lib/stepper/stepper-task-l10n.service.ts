import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { PortCommandTask, StepperBindingInputAction, TaskType } from '@app/store';

import { ITaskSummaryBuilder } from '../i-task-summary-builder';

@Injectable()
export class StepperTaskL10nService implements ITaskSummaryBuilder<TaskType.Stepper> {
    constructor(
        private readonly translocoService: TranslocoService,
    ) {
    }

    public buildTaskSummary(
        task: PortCommandTask<TaskType.Stepper>
    ): Observable<string> {
        if (task.payload.action === StepperBindingInputAction.Cw) {
            return this.translocoService.selectTranslate('controlScheme.tasks.stepperCwSummary', task.payload);
        } else {
            return this.translocoService.selectTranslate('controlScheme.tasks.stepperCcwSummary', task.payload);
        }
    }
}
