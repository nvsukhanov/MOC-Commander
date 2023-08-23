import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TranslocoService } from '@ngneat/transloco';
import { SpeedStepperTaskPayload } from '@app/store';

@Injectable({ providedIn: 'root' })
export class SpeedStepperPortCommandTaskSummaryBuilderService {
    constructor(
        private readonly translocoService: TranslocoService
    ) {
    }

    public build(
        task: SpeedStepperTaskPayload
    ): Observable<string> {
        return this.translocoService.selectTranslate(
            'controlScheme.speedStepperBinding.taskSummary',
            {
                speed: task.speed,
            }
        );
    }
}
