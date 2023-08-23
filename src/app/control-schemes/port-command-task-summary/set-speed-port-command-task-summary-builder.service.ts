import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TranslocoService } from '@ngneat/transloco';
import { SetSpeedTaskPayload } from '@app/store';

@Injectable({ providedIn: 'root' })
export class SetSpeedPortCommandTaskSummaryBuilderService {
    constructor(
        private readonly translocoService: TranslocoService
    ) {
    }

    public build(
        payload: SetSpeedTaskPayload
    ): Observable<string> {
        if (payload.power !== 0 && payload.speed === 0) {
            return this.translocoService.selectTranslate('controlScheme.setSpeedBinding.brakeTaskSummary');
        }
        return this.translocoService.selectTranslate('controlScheme.setSpeedBinding.taskSummary', payload);
    }
}
