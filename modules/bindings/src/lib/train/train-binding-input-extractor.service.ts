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
        return {
            [TrainBindingInputAction.NextSpeed]: this.getInputId(binding, TrainBindingInputAction.NextSpeed, globalInput) ?? null,
            [TrainBindingInputAction.PrevSpeed]: this.getInputId(binding, TrainBindingInputAction.PrevSpeed, globalInput) ?? null,
            [TrainBindingInputAction.Reset]: this.getInputId(binding, TrainBindingInputAction.Reset, globalInput) ?? null
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

    private getInputId(
        binding: ControlSchemeTrainBinding,
        action: keyof ControlSchemeTrainBinding['inputs'],
        globalInput: Dictionary<ControllerInputModel>
    ): ControllerInputModel | undefined {
        const inputConfig = binding.inputs[action];
        if (!inputConfig) {
            return;
        }
        const inputId = controllerInputIdFn(inputConfig);
        return globalInput[inputId];
    }
}
