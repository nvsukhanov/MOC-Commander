import { Dictionary } from '@ngrx/entity';
import { Injectable } from '@angular/core';
import { ControlSchemeBindingType } from '@app/shared-misc';
import { ControlSchemeBindingInputs, ControlSchemeServoBinding, ControllerInputModel, ServoInputAction, controllerInputIdFn } from '@app/store';

import { BindingInputExtractionResult, IBindingTaskInputExtractor } from '../i-binding-task-input-extractor';

@Injectable()
export class ServoInputExtractorService implements IBindingTaskInputExtractor<ControlSchemeBindingType.Servo> {
    public extractInput(
        binding: ControlSchemeServoBinding,
        globalInput: Dictionary<ControllerInputModel>
    ): BindingInputExtractionResult<ControlSchemeBindingType.Servo> {
        return {
            [ServoInputAction.Cw]: this.getInputId(binding, ServoInputAction.Cw, globalInput) ?? null,
            [ServoInputAction.Ccw]: this.getInputId(binding, ServoInputAction.Ccw, globalInput) ?? null,
        };
    }

    public isInputChanged(
        prevInput: BindingInputExtractionResult<ControlSchemeBindingType.Servo>,
        nextInput: BindingInputExtractionResult<ControlSchemeBindingType.Servo>
    ): boolean {
        return prevInput[ServoInputAction.Cw] !== nextInput[ServoInputAction.Cw]
            || prevInput[ServoInputAction.Ccw] !== nextInput[ServoInputAction.Ccw];
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
