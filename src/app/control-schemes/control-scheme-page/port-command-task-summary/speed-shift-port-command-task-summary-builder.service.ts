import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TranslocoService } from '@ngneat/transloco';
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
        return this.translocoService.selectTranslate('controlScheme.speedShiftBinding.taskSummary', payload);
    }
}
