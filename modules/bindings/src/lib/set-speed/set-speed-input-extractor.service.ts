import { Injectable } from '@angular/core';
import { Dictionary } from '@ngrx/entity';
import { ControlSchemeBindingType } from '@app/shared-misc';
import { ControlSchemeInputAction, ControlSchemeSetSpeedBinding, ControllerInputModel, controllerInputIdFn } from '@app/store';

import { BindingInputExtractionResult, IBindingTaskInputExtractor } from '../i-binding-task-input-extractor';

@Injectable()
export class SetSpeedInputExtractorService implements IBindingTaskInputExtractor<ControlSchemeBindingType.SetSpeed> {
    public extractInput(
        binding: ControlSchemeSetSpeedBinding,
        globalInput: Dictionary<ControllerInputModel>
    ): BindingInputExtractionResult<ControlSchemeBindingType.SetSpeed> {
        const accelerationInputId = controllerInputIdFn(binding.inputs[ControlSchemeInputAction.Accelerate]);
        const accelerationInputResult = globalInput[accelerationInputId];
        const brakeInputConfigModel = binding.inputs[ControlSchemeInputAction.Brake];
        const brakeInputResult = brakeInputConfigModel ? globalInput[controllerInputIdFn(brakeInputConfigModel)] : null;
        return {
            [ControlSchemeInputAction.Accelerate]: accelerationInputResult ?? null,
            [ControlSchemeInputAction.Brake]: brakeInputResult ?? null
        };
    }

    public isInputChanged(
        prevInput: BindingInputExtractionResult<ControlSchemeBindingType.SetSpeed>,
        nextInput: BindingInputExtractionResult<ControlSchemeBindingType.SetSpeed>
    ): boolean {
        return prevInput[ControlSchemeInputAction.Accelerate] !== nextInput[ControlSchemeInputAction.Accelerate]
            || prevInput[ControlSchemeInputAction.Brake] !== nextInput[ControlSchemeInputAction.Brake];
    }
}
