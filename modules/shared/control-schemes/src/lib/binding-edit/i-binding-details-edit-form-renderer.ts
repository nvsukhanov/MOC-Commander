import { Observable } from 'rxjs';
import { ControlSchemeBindingType } from '@app/shared-misc';
import { ControlSchemeBinding } from '@app/store';

export interface IBindingDetailsEditFormRenderer {
    readonly bindingChange: Observable<ControlSchemeBinding | null>;

    setBindingType(
        bindingType: ControlSchemeBindingType
    ): void;

    setBinding(
        binding: Partial<ControlSchemeBinding> | undefined
    ): void;

    dispose(): void;
}
