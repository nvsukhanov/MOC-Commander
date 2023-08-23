import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TranslocoService } from '@ngneat/transloco';
import { StepperTaskPayload } from '@app/store';

@Injectable({ providedIn: 'root' })
export class StepperPortCommandTaskSummaryBuilderService {
    constructor(
        private readonly translocoService: TranslocoService
    ) {
    }

    public build(
        payload: StepperTaskPayload
    ): Observable<string> {
        return this.translocoService.selectTranslate('controlScheme.stepperBinding.taskSummary', payload);
    }
}
