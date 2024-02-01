import { Dictionary } from '@ngrx/entity';
import { Injectable } from '@angular/core';
import { ControlSchemeBindingType } from '@app/shared-misc';
import { ControlSchemeInputAction, ControlSchemeTrainControlBinding, ControllerInputModel, controllerInputIdFn } from '@app/store';

import { BindingInputExtractionResult, IBindingTaskInputExtractor } from '../i-binding-task-input-extractor';

@Injectable()
export class TrainControlTaskInputExtractorService implements IBindingTaskInputExtractor<ControlSchemeBindingType.TrainControl> {
    public extractInput(
        binding: ControlSchemeTrainControlBinding,
        globalInput: Dictionary<ControllerInputModel>
    ): BindingInputExtractionResult<ControlSchemeBindingType.TrainControl> {
        const nextLevelInputId = controllerInputIdFn(binding.inputs[ControlSchemeInputAction.NextLevel]);
        const nextLevelInputResult = globalInput[nextLevelInputId];
        const prevLevelInputId = binding.inputs[ControlSchemeInputAction.PrevLevel];
        const prevLevelInputResult = prevLevelInputId ? globalInput[controllerInputIdFn(prevLevelInputId)] : null;
        const resetInputId = binding.inputs[ControlSchemeInputAction.Reset];
        const resetInputResult = resetInputId ? globalInput[controllerInputIdFn(resetInputId)] : null;
        return {
            [ControlSchemeInputAction.NextLevel]: nextLevelInputResult ?? null,
            [ControlSchemeInputAction.PrevLevel]: prevLevelInputResult ?? null,
            [ControlSchemeInputAction.Reset]: resetInputResult ?? null
        };
    }

    public isInputChanged(
        prevInput: BindingInputExtractionResult<ControlSchemeBindingType.TrainControl>,
        nextInput: BindingInputExtractionResult<ControlSchemeBindingType.TrainControl>
    ): boolean {
        return prevInput[ControlSchemeInputAction.NextLevel] !== nextInput[ControlSchemeInputAction.NextLevel]
            || prevInput[ControlSchemeInputAction.PrevLevel] !== nextInput[ControlSchemeInputAction.PrevLevel]
            || prevInput[ControlSchemeInputAction.Reset] !== nextInput[ControlSchemeInputAction.Reset];
    }
}
