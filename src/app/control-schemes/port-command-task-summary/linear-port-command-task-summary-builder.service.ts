import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TranslocoService } from '@ngneat/transloco';
import { SetLinearSpeedTaskPayload } from '@app/store';

@Injectable({ providedIn: 'root' })
export class LinearPortCommandTaskSummaryBuilderService {
    constructor(
        private readonly translocoService: TranslocoService
    ) {
    }

    public build(
        payload: SetLinearSpeedTaskPayload
    ): Observable<string> {
        if (payload.power !== 0 && payload.speed === 0) {
            return this.translocoService.selectTranslate('controlScheme.linearBinding.brakeTaskSummary');
        }
        return this.translocoService.selectTranslate('controlScheme.linearBinding.taskSummary', payload);
    }
}
