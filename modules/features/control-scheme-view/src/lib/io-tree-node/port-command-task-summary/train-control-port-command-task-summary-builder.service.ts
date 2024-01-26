import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TranslocoService } from '@ngneat/transloco';
import { MOTOR_LIMITS } from 'rxpoweredup';
import { TrainControlTaskPayload } from '@app/store';

@Injectable({ providedIn: 'root' })
export class TrainControlPortCommandTaskSummaryBuilderService {
    constructor(
        private readonly translocoService: TranslocoService
    ) {
    }

    public build(
        payload: TrainControlTaskPayload
    ): Observable<string> {
        const level = payload.initialLevelIndex - payload.speedIndex;
        const speedPercent = Math.round((payload.speed / MOTOR_LIMITS.maxSpeed) * 100);
        const isLooping = payload.isLooping;
        return this.translocoService.selectTranslate('controlScheme.trainControlBinding.taskSummary', { level, speedPercent, isLooping });
    }
}
