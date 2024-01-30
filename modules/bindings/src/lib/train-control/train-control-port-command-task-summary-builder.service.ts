import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TranslocoService } from '@ngneat/transloco';
import { MOTOR_LIMITS } from 'rxpoweredup';
import { PortCommandTask } from '@app/store';
import { ControlSchemeBindingType } from '@app/shared-misc';

import { IBindingTaskSummaryBuilder } from '../i-binding-task-summary-builder';

@Injectable()
export class TrainControlPortCommandTaskSummaryBuilderService implements IBindingTaskSummaryBuilder<ControlSchemeBindingType.TrainControl> {
    constructor(
        private readonly translocoService: TranslocoService
    ) {
    }

    public buildTaskSummary(
        task: PortCommandTask<ControlSchemeBindingType.TrainControl>
    ): Observable<string> {
        const level = task.payload.initialLevelIndex - task.payload.speedIndex;
        const speedPercent = Math.round((task.payload.speed / MOTOR_LIMITS.maxSpeed) * 100);
        const isLooping = task.payload.isLooping;
        return this.translocoService.selectTranslate('controlScheme.trainControlBinding.taskSummary', { level, speedPercent, isLooping });
    }
}
