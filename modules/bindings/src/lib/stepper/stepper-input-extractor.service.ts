import { Dictionary } from '@ngrx/entity';
import { Injectable } from '@angular/core';
import { ControlSchemeBindingType } from '@app/shared-misc';
import { ControlSchemeBindingInputs, ControlSchemeStepperBinding, ControllerInputModel, StepperInputAction, controllerInputIdFn } from '@app/store';

import { BindingInputExtractionResult, IBindingTaskInputExtractor } from '../i-binding-task-input-extractor';

@Injectable()
export class StepperInputExtractorService implements IBindingTaskInputExtractor<ControlSchemeBindingType.Stepper> {
    public extractInput(
        binding: ControlSchemeStepperBinding,
        globalInput: Dictionary<ControllerInputModel>
    ): BindingInputExtractionResult<ControlSchemeBindingType.Stepper> {
        return {
            [StepperInputAction.Cw]: this.getInputId(binding, StepperInputAction.Cw, globalInput) ?? null,
            [StepperInputAction.Ccw]: this.getInputId(binding, StepperInputAction.Ccw, globalInput) ?? null,
        };
    }

    public isInputChanged(
        prevInput: BindingInputExtractionResult<ControlSchemeBindingType.Stepper>,
        nextInput: BindingInputExtractionResult<ControlSchemeBindingType.Stepper>
    ): boolean {
        return prevInput[StepperInputAction.Cw] !== nextInput[StepperInputAction.Cw]
            || prevInput[StepperInputAction.Ccw] !== nextInput[StepperInputAction.Ccw];
    }

    private getInputId(
        binding: ControlSchemeStepperBinding,
        action: keyof ControlSchemeBindingInputs<ControlSchemeBindingType.Stepper>,
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
