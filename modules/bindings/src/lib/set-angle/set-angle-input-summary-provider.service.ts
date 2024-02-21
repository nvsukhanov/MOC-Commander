import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TranslocoService } from '@ngneat/transloco';
import { ControlSchemeSetAngleBinding } from '@app/store';

@Injectable()
export class SetAngleInputSummaryProviderService {
    constructor(
        private readonly transloco: TranslocoService
    ) {
    }

    public provideInputSummary(
        binding: ControlSchemeSetAngleBinding
    ): Observable<string> {
        return this.transloco.selectTranslate('controlScheme.setAngleBinding.inputAction', binding);
    }
}
