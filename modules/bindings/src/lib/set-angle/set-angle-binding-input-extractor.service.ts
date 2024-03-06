import { Dictionary } from '@ngrx/entity';
import { Injectable } from '@angular/core';
import { ControlSchemeBindingType } from '@app/shared-misc';
import { ControlSchemeSetAngleBinding, ControllerInputModel, SetAngleBindingInputAction, controllerInputIdFn } from '@app/store';

import { BindingInputExtractionResult, IBindingTaskInputExtractor } from '../i-binding-task-input-extractor';

@Injectable()
export class SetAngleBindingInputExtractorService implements IBindingTaskInputExtractor<ControlSchemeBindingType.SetAngle> {
    public extractInput(
        binding: ControlSchemeSetAngleBinding,
        globalInput: Dictionary<ControllerInputModel>
    ): BindingInputExtractionResult<ControlSchemeBindingType.SetAngle> {
        const setAngleInputId = controllerInputIdFn(binding.inputs[SetAngleBindingInputAction.SetAngle]);
        const setAngleInputResult = globalInput[setAngleInputId];
        return {
            [SetAngleBindingInputAction.SetAngle]: setAngleInputResult ?? null
        };
    }

    public isInputChanged(
        prevInput: BindingInputExtractionResult<ControlSchemeBindingType.SetAngle>,
        nextInput: BindingInputExtractionResult<ControlSchemeBindingType.SetAngle>
    ): boolean {
        return prevInput[SetAngleBindingInputAction.SetAngle] !== nextInput[SetAngleBindingInputAction.SetAngle];
    }

}
