import { Inject, Pipe, PipeTransform } from '@angular/core';
import { ControlSchemeBindingType } from '@app/shared-misc';

import { BINDING_TYPE_TO_L10N_KEY_MAPPER, IBindingTypeToL10nKeyMapper } from './i-binding-type-to-l10n-key-mapper';

@Pipe({
    name: 'bindingTypeToL10nKey',
    pure: true,
    standalone: true
})
export class BindingTypeToL10nKeyPipe implements PipeTransform {
    constructor(
        @Inject(BINDING_TYPE_TO_L10N_KEY_MAPPER) private readonly bindingTypeToL10nKeyMapper: IBindingTypeToL10nKeyMapper
    ) {
    }

    public transform(
        bindingType: ControlSchemeBindingType
    ): string {
        return this.bindingTypeToL10nKeyMapper.mapBindingTypeToL10nKey(bindingType);
    }
}
