import { Injectable } from '@angular/core';
import { Dictionary } from '@ngrx/entity';
import { ControlSchemeBindingType } from '@app/shared-misc';
import { ControlSchemeSpeedBinding, ControllerInputModel, SpeedBindingInputAction, controllerInputIdFn } from '@app/store';

import { BindingInputExtractionResult, IBindingTaskInputExtractor } from '../i-binding-task-input-extractor';

@Injectable()
export class SpeedBindingInputExtractorService implements IBindingTaskInputExtractor<ControlSchemeBindingType.Speed> {
    public extractInput(
        binding: ControlSchemeSpeedBinding,
        globalInput: Dictionary<ControllerInputModel>
    ): BindingInputExtractionResult<ControlSchemeBindingType.Speed> {
        return {
            [SpeedBindingInputAction.Forwards]: this.extractInputResult(binding, globalInput, SpeedBindingInputAction.Forwards),
            [SpeedBindingInputAction.Backwards]: this.extractInputResult(binding, globalInput, SpeedBindingInputAction.Backwards),
            [SpeedBindingInputAction.Brake]: this.extractInputResult(binding, globalInput, SpeedBindingInputAction.Brake)
        };
    }

    public isInputChanged(
        prevInput: BindingInputExtractionResult<ControlSchemeBindingType.Speed>,
        nextInput: BindingInputExtractionResult<ControlSchemeBindingType.Speed>
    ): boolean {
        return prevInput[SpeedBindingInputAction.Forwards] !== nextInput[SpeedBindingInputAction.Forwards]
            || prevInput[SpeedBindingInputAction.Backwards] !== nextInput[SpeedBindingInputAction.Backwards]
            || prevInput[SpeedBindingInputAction.Brake] !== nextInput[SpeedBindingInputAction.Brake];
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
