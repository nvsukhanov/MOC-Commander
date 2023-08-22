import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TranslocoService } from '@ngneat/transloco';
import { AttachedIoPropsModel, ServoTaskPayload } from '@app/store';

@Injectable({ providedIn: 'root' })
export class ServoPortCommandTaskSummaryBuilderService {
    constructor(
        private readonly translocoService: TranslocoService
    ) {
    }

    public build(
        attachedIoProps: AttachedIoPropsModel,
        payload: ServoTaskPayload
    ): Observable<string> {
        const angle = (attachedIoProps.motorEncoderOffset ?? 0) + payload.angle;
        return this.translocoService.selectTranslate('controlScheme.servoTaskSummary', { angle });
    }
}
