import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TranslocoService } from '@ngneat/transloco';
import { AngleShiftTaskPayload, AttachedIoPropsModel } from '@app/store';

@Injectable({ providedIn: 'root' })
export class AngleShiftPortCommandTaskSummaryBuilderService {
    constructor(
        private readonly translocoService: TranslocoService
    ) {
    }

    public build(
        attachedIoProps: AttachedIoPropsModel,
        payload: AngleShiftTaskPayload
    ): Observable<string> {
        const angle = payload.angle - (attachedIoProps.motorEncoderOffset ?? 0);
        return this.translocoService.selectTranslate('controlScheme.angleShiftBinding.taskSummary', { angle });
    }
}
