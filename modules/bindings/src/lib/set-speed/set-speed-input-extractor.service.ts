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
        return {
            [ControlSchemeInputAction.Forwards]: this.extractInputResult(binding, globalInput, ControlSchemeInputAction.Forwards),
            [ControlSchemeInputAction.Backwards]: this.extractInputResult(binding, globalInput, ControlSchemeInputAction.Backwards),
            [ControlSchemeInputAction.Brake]: this.extractInputResult(binding, globalInput, ControlSchemeInputAction.Brake)
        };
    }

    public isInputChanged(
        prevInput: BindingInputExtractionResult<ControlSchemeBindingType.SetSpeed>,
        nextInput: BindingInputExtractionResult<ControlSchemeBindingType.SetSpeed>
    ): boolean {
        return prevInput[ControlSchemeInputAction.Forwards] !== nextInput[ControlSchemeInputAction.Forwards]
            || prevInput[ControlSchemeInputAction.Backwards] !== nextInput[ControlSchemeInputAction.Backwards]
            || prevInput[ControlSchemeInputAction.Brake] !== nextInput[ControlSchemeInputAction.Brake];
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
