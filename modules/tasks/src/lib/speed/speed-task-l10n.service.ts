import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { PortCommandTask, TaskType } from '@app/store';
import { calculateSpeedPower } from '@app/shared-misc';

import { ITaskSummaryBuilder } from '../i-task-summary-builder';

@Injectable()
export class SpeedTaskL10nService implements ITaskSummaryBuilder<TaskType.Speed> {
    constructor(
        private readonly translocoService: TranslocoService,
    ) {
    }

    public buildTaskSummary(
        task: PortCommandTask<TaskType.Speed>
    ): Observable<string> {
        const { speed, power } = calculateSpeedPower(task.payload.speed, task.payload.brakeFactor, task.payload.power);
        if (power !== 0 && speed === 0) {
            return this.translocoService.selectTranslate('controlScheme.speedBinding.brakeTaskSummary');
        }
        return this.translocoService.selectTranslate('controlScheme.speedBinding.taskSummary', { speed });
    }
}
