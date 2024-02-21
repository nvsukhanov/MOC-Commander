import { Inject, Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs';
import { ControlSchemeBinding } from '@app/store';

import { BINDING_INPUT_SUMMARY_PROVIDER, IBindingInputSummaryProvider } from './i-binding-input-summary-provider';

@Pipe({
    standalone: true,
    name: 'bindingInputSummary',
    pure: true
})
export class BindingInputSummaryPipe implements PipeTransform {
    constructor(
        @Inject(BINDING_INPUT_SUMMARY_PROVIDER) private readonly bindingInputSummaryProvider: IBindingInputSummaryProvider
    ) {
    }

    public transform<T extends ControlSchemeBinding>(
        binding: T,
        action: keyof T['inputs']
    ): Observable<string> {
        return this.bindingInputSummaryProvider.getBindingInputSummary(binding, action);
    }
}
