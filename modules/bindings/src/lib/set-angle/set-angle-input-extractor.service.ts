import { Dictionary } from '@ngrx/entity';
import { Injectable } from '@angular/core';
import { ControlSchemeBindingType } from '@app/shared-misc';
import { ControlSchemeInputAction, ControlSchemeSetAngleBinding, ControllerInputModel, controllerInputIdFn } from '@app/store';

import { BindingInputExtractionResult, IBindingTaskInputExtractor } from '../i-binding-task-input-extractor';

@Injectable()
export class SetAngleInputExtractorService implements IBindingTaskInputExtractor<ControlSchemeBindingType.SetAngle> {
    public extractInput(
        binding: ControlSchemeSetAngleBinding,
        globalInput: Dictionary<ControllerInputModel>
    ): BindingInputExtractionResult<ControlSchemeBindingType.SetAngle> {
        const setAngleInputId = controllerInputIdFn(binding.inputs[ControlSchemeInputAction.SetAngle]);
        const setAngleInputResult = globalInput[setAngleInputId];
        return {
            [ControlSchemeInputAction.SetAngle]: setAngleInputResult ?? null
        };
    }

    public isInputChanged(
        prevInput: BindingInputExtractionResult<ControlSchemeBindingType.SetAngle>,
        nextInput: BindingInputExtractionResult<ControlSchemeBindingType.SetAngle>
    ): boolean {
        return prevInput[ControlSchemeInputAction.SetAngle] !== nextInput[ControlSchemeInputAction.SetAngle];
    }

}
