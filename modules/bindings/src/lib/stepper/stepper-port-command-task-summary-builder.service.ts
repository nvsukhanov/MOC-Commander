import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TranslocoService } from '@ngneat/transloco';
import { PortCommandTask } from '@app/store';
import { ControlSchemeBindingType } from '@app/shared-misc';

import { IBindingTaskSummaryBuilder } from '../i-binding-task-summary-builder';

@Injectable()
export class StepperPortCommandTaskSummaryBuilderService implements IBindingTaskSummaryBuilder<ControlSchemeBindingType.Stepper> {
    constructor(
        private readonly translocoService: TranslocoService
    ) {
    }

    public buildTaskSummary(
        task: PortCommandTask<ControlSchemeBindingType.Stepper>
    ): Observable<string> {
        return this.translocoService.selectTranslate('controlScheme.stepperBinding.taskSummary', task.payload);
    }
}
