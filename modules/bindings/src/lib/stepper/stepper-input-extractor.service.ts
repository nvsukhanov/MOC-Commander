import { Dictionary } from '@ngrx/entity';
import { Injectable } from '@angular/core';
import { ControlSchemeBindingType } from '@app/shared-misc';
import { ControlSchemeInputAction, ControlSchemeStepperBinding, ControllerInputModel, controllerInputIdFn } from '@app/store';

import { BindingInputExtractionResult, IBindingTaskInputExtractor } from '../i-binding-task-input-extractor';

@Injectable()
export class StepperInputExtractorService implements IBindingTaskInputExtractor<ControlSchemeBindingType.Stepper> {
    public extractInput(
        binding: ControlSchemeStepperBinding,
        globalInput: Dictionary<ControllerInputModel>
    ): BindingInputExtractionResult<ControlSchemeBindingType.Stepper> {
        const steInputId = controllerInputIdFn(binding.inputs[ControlSchemeInputAction.Step]);
        const stepInputResult = globalInput[steInputId];
        return {
            [ControlSchemeInputAction.Step]: stepInputResult ?? null
        };
    }

    public isInputChanged(
        prevInput: BindingInputExtractionResult<ControlSchemeBindingType.Stepper>,
        nextInput: BindingInputExtractionResult<ControlSchemeBindingType.Stepper>
    ): boolean {
        return prevInput[ControlSchemeInputAction.Step] !== nextInput[ControlSchemeInputAction.Step];
    }

}
