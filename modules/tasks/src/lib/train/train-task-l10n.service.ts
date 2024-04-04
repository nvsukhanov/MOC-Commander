import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { MOTOR_LIMITS } from 'rxpoweredup';
import { PortCommandTask, TaskType } from '@app/store';

import { ITaskSummaryBuilder } from '../i-task-summary-builder';

@Injectable()
export class TrainTaskL10nService implements ITaskSummaryBuilder<TaskType.Train> {
    constructor(
        private readonly translocoService: TranslocoService
    ) {
    }

    public buildTaskSummary(
        task: PortCommandTask<TaskType.Train>
    ): Observable<string> {
        const level = task.payload.initialLevelIndex - task.payload.speedIndex;
        const speedPercent = Math.round((task.payload.speed / MOTOR_LIMITS.maxSpeed) * 100);
        const isLooping = task.payload.isLooping;
        return this.translocoService.selectTranslate('controlScheme.tasks.trainSummary', { level, speedPercent, isLooping });
    }
}
