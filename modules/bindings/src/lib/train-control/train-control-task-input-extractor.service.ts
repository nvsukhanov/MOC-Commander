import { Dictionary } from '@ngrx/entity';
import { Injectable } from '@angular/core';
import { ControlSchemeBindingType } from '@app/shared-misc';
import { ControlSchemeTrainControlBinding, ControllerInputModel, TrainControlInputAction, controllerInputIdFn } from '@app/store';

import { BindingInputExtractionResult, IBindingTaskInputExtractor } from '../i-binding-task-input-extractor';

@Injectable()
export class TrainControlTaskInputExtractorService implements IBindingTaskInputExtractor<ControlSchemeBindingType.TrainControl> {
    public extractInput(
        binding: ControlSchemeTrainControlBinding,
        globalInput: Dictionary<ControllerInputModel>
    ): BindingInputExtractionResult<ControlSchemeBindingType.TrainControl> {
        const nextLevelInputId = controllerInputIdFn(binding.inputs[TrainControlInputAction.NextSpeed]);
        const nextLevelInputResult = globalInput[nextLevelInputId];
        const prevLevelInputId = binding.inputs[TrainControlInputAction.PrevSpeed];
        const prevLevelInputResult = prevLevelInputId ? globalInput[controllerInputIdFn(prevLevelInputId)] : null;
        const resetInputId = binding.inputs[TrainControlInputAction.Reset];
        const resetInputResult = resetInputId ? globalInput[controllerInputIdFn(resetInputId)] : null;
        return {
            [TrainControlInputAction.NextSpeed]: nextLevelInputResult ?? null,
            [TrainControlInputAction.PrevSpeed]: prevLevelInputResult ?? null,
            [TrainControlInputAction.Reset]: resetInputResult ?? null
        };
    }

    public isInputChanged(
        prevInput: BindingInputExtractionResult<ControlSchemeBindingType.TrainControl>,
        nextInput: BindingInputExtractionResult<ControlSchemeBindingType.TrainControl>
    ): boolean {
        return prevInput[TrainControlInputAction.NextSpeed] !== nextInput[TrainControlInputAction.NextSpeed]
            || prevInput[TrainControlInputAction.PrevSpeed] !== nextInput[TrainControlInputAction.PrevSpeed]
            || prevInput[TrainControlInputAction.Reset] !== nextInput[TrainControlInputAction.Reset];
    }
}
