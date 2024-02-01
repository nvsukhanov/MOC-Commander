import { Dictionary } from '@ngrx/entity';
import { ControlSchemeBinding, ControlSchemeBindingInputs, ControllerInputModel } from '@app/store';
import { ControlSchemeBindingType } from '@app/shared-misc';

export type BindingInputExtractionResult<T extends ControlSchemeBindingType> = {
    [ k in keyof ControlSchemeBindingInputs<T> ]: ControllerInputModel | null
};

export interface IBindingTaskInputExtractor<T extends ControlSchemeBindingType> {
    extractInput(
        binding: ControlSchemeBinding & { bindingType: T },
        globalInput: Dictionary<ControllerInputModel>
    ): BindingInputExtractionResult<T>;

    isInputChanged(
        prevInput: BindingInputExtractionResult<T>,
        nextInput: BindingInputExtractionResult<T>
    ): boolean;
}
