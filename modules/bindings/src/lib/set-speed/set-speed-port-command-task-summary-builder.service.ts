import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TranslocoService } from '@ngneat/transloco';
import { PortCommandTask } from '@app/store';
import { ControlSchemeBindingType, calculateSpeedPower } from '@app/shared-misc';

import { IBindingTaskSummaryBuilder } from '../i-binding-task-summary-builder';

@Injectable()
export class SetSpeedPortCommandTaskSummaryBuilderService implements IBindingTaskSummaryBuilder<ControlSchemeBindingType.SetSpeed> {
    constructor(
        private readonly translocoService: TranslocoService
    ) {
    }

    public buildTaskSummary(
        task: PortCommandTask<ControlSchemeBindingType.SetSpeed>
    ): Observable<string> {
        const { speed, power } = calculateSpeedPower(task.payload.speed, task.payload.brakeFactor, task.payload.power);
        if (power !== 0 && speed === 0) {
            return this.translocoService.selectTranslate('controlScheme.setSpeedBinding.brakeTaskSummary');
        }
        return this.translocoService.selectTranslate('controlScheme.setSpeedBinding.taskSummary', { speed });
    }
}
