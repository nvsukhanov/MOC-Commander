import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TranslocoService } from '@ngneat/transloco';
import { MOTOR_LIMITS } from 'rxpoweredup';
import { SpeedShiftTaskPayload } from '@app/store';

@Injectable({ providedIn: 'root' })
export class SpeedShiftPortCommandTaskSummaryBuilderService {
    constructor(
        private readonly translocoService: TranslocoService
    ) {
    }

    public build(
        payload: SpeedShiftTaskPayload
    ): Observable<string> {
        const level = payload.initialLevelIndex - payload.speedIndex;
        const speedPercent = Math.round((payload.speed / MOTOR_LIMITS.maxSpeed) * 100);
        return this.translocoService.selectTranslate('controlScheme.speedShiftBinding.taskSummary', { level, speedPercent });
    }
}
