import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TranslocoService } from '@ngneat/transloco';
import { SetSpeedTaskPayload, calculateSpeedPower } from '@app/store';

@Injectable({ providedIn: 'root' })
export class SetSpeedPortCommandTaskSummaryBuilderService {
    constructor(
        private readonly translocoService: TranslocoService
    ) {
    }

    public build(
        payload: SetSpeedTaskPayload
    ): Observable<string> {
        const { speed, power } = calculateSpeedPower(payload.speed, payload.brakeFactor, payload.power);
        if (power !== 0 && speed === 0) {
            return this.translocoService.selectTranslate('controlScheme.setSpeedBinding.brakeTaskSummary');
        }
        return this.translocoService.selectTranslate('controlScheme.setSpeedBinding.taskSummary', { speed });
    }
}
