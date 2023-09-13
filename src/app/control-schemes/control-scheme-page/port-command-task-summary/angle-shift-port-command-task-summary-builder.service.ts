import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TranslocoService } from '@ngneat/transloco';
import { AngleShiftTaskPayload } from '@app/store';

@Injectable({ providedIn: 'root' })
export class AngleShiftPortCommandTaskSummaryBuilderService {
    constructor(
        private readonly translocoService: TranslocoService
    ) {
    }

    public build(
        payload: AngleShiftTaskPayload
    ): Observable<string> {
        const level = payload.initialLevelIndex - payload.angleIndex;
        return this.translocoService.selectTranslate('controlScheme.angleShiftBinding.taskSummary', { level });
    }
}
