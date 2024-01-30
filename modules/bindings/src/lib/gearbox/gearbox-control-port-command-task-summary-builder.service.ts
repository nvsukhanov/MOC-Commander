import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TranslocoService } from '@ngneat/transloco';
import { GearboxControlTaskPayload } from '@app/store';

@Injectable()
export class GearboxControlPortCommandTaskSummaryBuilderService {
    constructor(
        private readonly translocoService: TranslocoService
    ) {
    }

    public build(
        payload: GearboxControlTaskPayload
    ): Observable<string> {
        const level = payload.initialLevelIndex - payload.angleIndex;
        const angle = payload.angle;
        const isLooping = payload.isLooping;
        return this.translocoService.selectTranslate('controlScheme.gearboxControlBinding.taskSummary', { level, angle, isLooping });
    }
}
