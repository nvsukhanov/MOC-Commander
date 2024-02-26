import { Dictionary } from '@ngrx/entity';
import { Injectable } from '@angular/core';
import { ControlSchemeBindingType } from '@app/shared-misc';
import { ControlSchemeBindingInputs, ControlSchemeInputAction, ControlSchemeServoBinding, ControllerInputModel, controllerInputIdFn } from '@app/store';

import { BindingInputExtractionResult, IBindingTaskInputExtractor } from '../i-binding-task-input-extractor';

@Injectable()
export class ServoInputExtractorService implements IBindingTaskInputExtractor<ControlSchemeBindingType.Servo> {
    public extractInput(
        binding: ControlSchemeServoBinding,
        globalInput: Dictionary<ControllerInputModel>
    ): BindingInputExtractionResult<ControlSchemeBindingType.Servo> {
        return {
            [ControlSchemeInputAction.ServoCw]: this.getInputId(binding, ControlSchemeInputAction.ServoCw, globalInput) ?? null,
            [ControlSchemeInputAction.ServoCcw]: this.getInputId(binding, ControlSchemeInputAction.ServoCcw, globalInput) ?? null,
        };
    }

    public isInputChanged(
        prevInput: BindingInputExtractionResult<ControlSchemeBindingType.Servo>,
        nextInput: BindingInputExtractionResult<ControlSchemeBindingType.Servo>
    ): boolean {
        return prevInput[ControlSchemeInputAction.ServoCw] !== nextInput[ControlSchemeInputAction.ServoCw]
            || prevInput[ControlSchemeInputAction.ServoCcw] !== nextInput[ControlSchemeInputAction.ServoCcw];
    }

    private getInputId(
        binding: ControlSchemeServoBinding,
        action: keyof ControlSchemeBindingInputs<ControlSchemeBindingType.Servo>,
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
