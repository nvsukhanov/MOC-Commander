import { Injectable } from '@angular/core';
import { Dictionary } from '@ngrx/entity';
import { ControlSchemeBindingType } from '@app/shared-misc';
import { ControlSchemeSetSpeedBinding, ControllerInputModel, SetSpeedInputAction, controllerInputIdFn } from '@app/store';

import { BindingInputExtractionResult, IBindingTaskInputExtractor } from '../i-binding-task-input-extractor';

@Injectable()
export class SetSpeedInputExtractorService implements IBindingTaskInputExtractor<ControlSchemeBindingType.SetSpeed> {
    public extractInput(
        binding: ControlSchemeSetSpeedBinding,
        globalInput: Dictionary<ControllerInputModel>
    ): BindingInputExtractionResult<ControlSchemeBindingType.SetSpeed> {
        return {
            [SetSpeedInputAction.Forwards]: this.extractInputResult(binding, globalInput, SetSpeedInputAction.Forwards),
            [SetSpeedInputAction.Backwards]: this.extractInputResult(binding, globalInput, SetSpeedInputAction.Backwards),
            [SetSpeedInputAction.Brake]: this.extractInputResult(binding, globalInput, SetSpeedInputAction.Brake)
        };
    }

    public isInputChanged(
        prevInput: BindingInputExtractionResult<ControlSchemeBindingType.SetSpeed>,
        nextInput: BindingInputExtractionResult<ControlSchemeBindingType.SetSpeed>
    ): boolean {
        return prevInput[SetSpeedInputAction.Forwards] !== nextInput[SetSpeedInputAction.Forwards]
            || prevInput[SetSpeedInputAction.Backwards] !== nextInput[SetSpeedInputAction.Backwards]
            || prevInput[SetSpeedInputAction.Brake] !== nextInput[SetSpeedInputAction.Brake];
    }

    private extractInputResult(
        binding: ControlSchemeSetSpeedBinding,
        globalInput: Dictionary<ControllerInputModel>,
        inputKey: keyof ControlSchemeSetSpeedBinding['inputs'],
    ): ControllerInputModel | null {
        const inputConfigModel = binding.inputs[inputKey];
        if (!inputConfigModel) {
            return null;
        }
        const inputId = controllerInputIdFn(inputConfigModel);
        return globalInput[inputId] ?? null;
    }
}
