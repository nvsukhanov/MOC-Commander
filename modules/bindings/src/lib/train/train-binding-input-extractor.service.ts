import { Dictionary } from '@ngrx/entity';
import { Injectable } from '@angular/core';
import { ControlSchemeBindingType } from '@app/shared-misc';
import { ControlSchemeTrainBinding, ControllerInputModel, TrainInputAction, controllerInputIdFn } from '@app/store';

import { BindingInputExtractionResult, IBindingTaskInputExtractor } from '../i-binding-task-input-extractor';

@Injectable()
export class TrainBindingInputExtractorService implements IBindingTaskInputExtractor<ControlSchemeBindingType.Train> {
    public extractInput(
        binding: ControlSchemeTrainBinding,
        globalInput: Dictionary<ControllerInputModel>
    ): BindingInputExtractionResult<ControlSchemeBindingType.Train> {
        const nextLevelInputId = controllerInputIdFn(binding.inputs[TrainInputAction.NextSpeed]);
        const nextLevelInputResult = globalInput[nextLevelInputId];
        const prevLevelInputId = binding.inputs[TrainInputAction.PrevSpeed];
        const prevLevelInputResult = prevLevelInputId ? globalInput[controllerInputIdFn(prevLevelInputId)] : null;
        const resetInputId = binding.inputs[TrainInputAction.Reset];
        const resetInputResult = resetInputId ? globalInput[controllerInputIdFn(resetInputId)] : null;
        return {
            [TrainInputAction.NextSpeed]: nextLevelInputResult ?? null,
            [TrainInputAction.PrevSpeed]: prevLevelInputResult ?? null,
            [TrainInputAction.Reset]: resetInputResult ?? null
        };
    }

    public isInputChanged(
        prevInput: BindingInputExtractionResult<ControlSchemeBindingType.Train>,
        nextInput: BindingInputExtractionResult<ControlSchemeBindingType.Train>
    ): boolean {
        return prevInput[TrainInputAction.NextSpeed] !== nextInput[TrainInputAction.NextSpeed]
            || prevInput[TrainInputAction.PrevSpeed] !== nextInput[TrainInputAction.PrevSpeed]
            || prevInput[TrainInputAction.Reset] !== nextInput[TrainInputAction.Reset];
    }
}
