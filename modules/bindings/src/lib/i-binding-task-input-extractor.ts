import { Dictionary } from '@ngrx/entity';
import { Observable } from 'rxjs';
import { ControlSchemeBinding, ControlSchemeBindingInputs, ControllerInputModel } from '@app/store';
import { ControlSchemeBindingType } from '@app/shared-misc';

export type BindingInputExtractionResult<T extends ControlSchemeBindingType> = {
    [ k in keyof ControlSchemeBindingInputs<T> ]: ControllerInputModel | null
};

export interface IBindingTaskInputExtractor<T extends ControlSchemeBindingType> {
    extractInputs(
        binding: ControlSchemeBinding & { bindingType: T },
        globalInput: Observable<Dictionary<ControllerInputModel>>
    ): Observable<BindingInputExtractionResult<T>>;
}
