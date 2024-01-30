import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TranslocoService } from '@ngneat/transloco';
import { AttachedIoPropsModel, SetAngleTaskPayload } from '@app/store';

@Injectable()
export class SetAnglePortCommandTaskSummaryBuilderService {
    constructor(
        private readonly translocoService: TranslocoService
    ) {
    }

    public build(
        attachedIoProps: AttachedIoPropsModel,
        payload: SetAngleTaskPayload
    ): Observable<string> {
        const angle = (attachedIoProps.motorEncoderOffset ?? 0) + payload.angle;
        return this.translocoService.selectTranslate('controlScheme.setAngleBinding.taskSummary', { angle });
    }
}
