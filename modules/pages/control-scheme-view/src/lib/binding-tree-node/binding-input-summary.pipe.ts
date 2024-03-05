import { Inject, Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs';
import { ControlSchemeBinding } from '@app/store';

import { BINDING_INPUT_NAME_RESOLVER, IBindingInputNameResolver } from './i-binding-input-name-resolver';

@Pipe({
    standalone: true,
    name: 'bindingInputSummary',
    pure: true
})
export class BindingInputSummaryPipe implements PipeTransform {
    constructor(
        @Inject(BINDING_INPUT_NAME_RESOLVER) private readonly bindingInputSummaryProvider: IBindingInputNameResolver
    ) {
    }

    public transform<T extends ControlSchemeBinding>(
        binding: T,
        action: keyof T['inputs']
    ): Observable<string> {
        return this.bindingInputSummaryProvider.getBindingInputName(binding, action);
    }
}
