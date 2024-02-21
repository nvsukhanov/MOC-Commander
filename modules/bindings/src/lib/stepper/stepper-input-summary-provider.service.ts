import { Injectable } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { Observable } from 'rxjs';
import { ControlSchemeStepperBinding } from '@app/store';

@Injectable()
export class StepperInputSummaryProviderService {
    constructor(
        private readonly transloco: TranslocoService
    ) {
    }

    public provideInputSummary(
        binding: ControlSchemeStepperBinding
    ): Observable<string> {
        return this.transloco.selectTranslate('controlScheme.stepperBinding.inputAction', binding);
    }
}
