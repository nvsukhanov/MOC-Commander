import { Dictionary } from '@ngrx/entity';
import { Injectable } from '@angular/core';
import { ControlSchemeBindingType } from '@app/shared-misc';
import { ControlSchemeTrainBinding, ControllerInputModel, TrainBindingInputAction, controllerInputIdFn } from '@app/store';

import { BindingInputExtractionResult, IBindingTaskInputExtractor } from '../i-binding-task-input-extractor';

@Injectable()
export class TrainBindingInputExtractorService implements IBindingTaskInputExtractor<ControlSchemeBindingType.Train> {
    public extractInput(
        binding: ControlSchemeTrainBinding,
        globalInput: Dictionary<ControllerInputModel>
    ): BindingInputExtractionResult<ControlSchemeBindingType.Train> {
        const nextLevelInputId = controllerInputIdFn(binding.inputs[TrainBindingInputAction.NextSpeed]);
        const nextLevelInputResult = globalInput[nextLevelInputId];
        const prevLevelInputId = binding.inputs[TrainBindingInputAction.PrevSpeed];
        const prevLevelInputResult = prevLevelInputId ? globalInput[controllerInputIdFn(prevLevelInputId)] : null;
        const resetInputId = binding.inputs[TrainBindingInputAction.Reset];
        const resetInputResult = resetInputId ? globalInput[controllerInputIdFn(resetInputId)] : null;
        return {
            [TrainBindingInputAction.NextSpeed]: nextLevelInputResult ?? null,
            [TrainBindingInputAction.PrevSpeed]: prevLevelInputResult ?? null,
            [TrainBindingInputAction.Reset]: resetInputResult ?? null
        };
    }

    public isInputChanged(
        prevInput: BindingInputExtractionResult<ControlSchemeBindingType.Train>,
        nextInput: BindingInputExtractionResult<ControlSchemeBindingType.Train>
    ): boolean {
        return prevInput[TrainBindingInputAction.NextSpeed] !== nextInput[TrainBindingInputAction.NextSpeed]
            || prevInput[TrainBindingInputAction.PrevSpeed] !== nextInput[TrainBindingInputAction.PrevSpeed]
            || prevInput[TrainBindingInputAction.Reset] !== nextInput[TrainBindingInputAction.Reset];
    }
}
