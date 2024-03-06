import { Dictionary } from '@ngrx/entity';
import { Injectable } from '@angular/core';
import { ControlSchemeBindingType } from '@app/shared-misc';
import { ControlSchemeBindingInputs, ControlSchemeStepperBinding, ControllerInputModel, StepperBindingInputAction, controllerInputIdFn } from '@app/store';

import { BindingInputExtractionResult, IBindingTaskInputExtractor } from '../i-binding-task-input-extractor';

@Injectable()
export class StepperBindingInputExtractorService implements IBindingTaskInputExtractor<ControlSchemeBindingType.Stepper> {
    public extractInput(
        binding: ControlSchemeStepperBinding,
        globalInput: Dictionary<ControllerInputModel>
    ): BindingInputExtractionResult<ControlSchemeBindingType.Stepper> {
        return {
            [StepperBindingInputAction.Cw]: this.getInputId(binding, StepperBindingInputAction.Cw, globalInput) ?? null,
            [StepperBindingInputAction.Ccw]: this.getInputId(binding, StepperBindingInputAction.Ccw, globalInput) ?? null,
        };
    }

    public isInputChanged(
        prevInput: BindingInputExtractionResult<ControlSchemeBindingType.Stepper>,
        nextInput: BindingInputExtractionResult<ControlSchemeBindingType.Stepper>
    ): boolean {
        return prevInput[StepperBindingInputAction.Cw] !== nextInput[StepperBindingInputAction.Cw]
            || prevInput[StepperBindingInputAction.Ccw] !== nextInput[StepperBindingInputAction.Ccw];
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
