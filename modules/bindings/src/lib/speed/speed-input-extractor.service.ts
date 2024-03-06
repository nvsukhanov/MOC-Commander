import { Injectable } from '@angular/core';
import { Dictionary } from '@ngrx/entity';
import { ControlSchemeBindingType } from '@app/shared-misc';
import { ControlSchemeSpeedBinding, ControllerInputModel, SpeedInputAction, controllerInputIdFn } from '@app/store';

import { BindingInputExtractionResult, IBindingTaskInputExtractor } from '../i-binding-task-input-extractor';

@Injectable()
export class SpeedInputExtractorService implements IBindingTaskInputExtractor<ControlSchemeBindingType.Speed> {
    public extractInput(
        binding: ControlSchemeSpeedBinding,
        globalInput: Dictionary<ControllerInputModel>
    ): BindingInputExtractionResult<ControlSchemeBindingType.Speed> {
        return {
            [SpeedInputAction.Forwards]: this.extractInputResult(binding, globalInput, SpeedInputAction.Forwards),
            [SpeedInputAction.Backwards]: this.extractInputResult(binding, globalInput, SpeedInputAction.Backwards),
            [SpeedInputAction.Brake]: this.extractInputResult(binding, globalInput, SpeedInputAction.Brake)
        };
    }

    public isInputChanged(
        prevInput: BindingInputExtractionResult<ControlSchemeBindingType.Speed>,
        nextInput: BindingInputExtractionResult<ControlSchemeBindingType.Speed>
    ): boolean {
        return prevInput[SpeedInputAction.Forwards] !== nextInput[SpeedInputAction.Forwards]
            || prevInput[SpeedInputAction.Backwards] !== nextInput[SpeedInputAction.Backwards]
            || prevInput[SpeedInputAction.Brake] !== nextInput[SpeedInputAction.Brake];
    }

    private extractInputResult(
        binding: ControlSchemeSpeedBinding,
        globalInput: Dictionary<ControllerInputModel>,
        inputKey: keyof ControlSchemeSpeedBinding['inputs'],
    ): ControllerInputModel | null {
        const inputConfigModel = binding.inputs[inputKey];
        if (!inputConfigModel) {
            return null;
        }
        const inputId = controllerInputIdFn(inputConfigModel);
        return globalInput[inputId] ?? null;
    }
}
