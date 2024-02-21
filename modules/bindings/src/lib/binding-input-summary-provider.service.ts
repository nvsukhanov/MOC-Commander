import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IBindingInputSummaryProvider } from '@app/control-scheme-view';
import { ControlSchemeBinding, ControlSchemeInputAction } from '@app/store';
import { ControlSchemeBindingType } from '@app/shared-misc';

import { GenericInputSummaryProviderService } from './common';
import { SetAngleInputSummaryProviderService } from './set-angle';
import { StepperInputSummaryProviderService } from './stepper';

@Injectable()
export class BindingInputSummaryProviderService implements IBindingInputSummaryProvider {
    constructor(
        private readonly genericInputSummaryProviderService: GenericInputSummaryProviderService,
        private readonly setAngleInputSummaryProviderService: SetAngleInputSummaryProviderService,
        private readonly stepperInputSummaryProviderService: StepperInputSummaryProviderService
    ) {
    }

    public getBindingInputSummary<T extends ControlSchemeBinding>(
        binding: T,
        action: keyof T['inputs']
    ): Observable<string> {
        switch (binding.bindingType) {
            case ControlSchemeBindingType.SetAngle:
                return this.setAngleInputSummaryProviderService.provideInputSummary(binding);
            case ControlSchemeBindingType.Stepper:
                return this.stepperInputSummaryProviderService.provideInputSummary(binding);
            default:
                return this.genericInputSummaryProviderService.provideInputSummary(action as ControlSchemeInputAction);
        }
    }
}
