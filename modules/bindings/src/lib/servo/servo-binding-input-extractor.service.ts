import { Dictionary } from '@ngrx/entity';
import { Injectable } from '@angular/core';
import { ControlSchemeBindingType } from '@app/shared-misc';
import { ControlSchemeBindingInputs, ControlSchemeServoBinding, ControllerInputModel, ServoBindingInputAction, controllerInputIdFn } from '@app/store';

import { BindingInputExtractionResult, IBindingTaskInputExtractor } from '../i-binding-task-input-extractor';

@Injectable()
export class ServoBindingInputExtractorService implements IBindingTaskInputExtractor<ControlSchemeBindingType.Servo> {
    public extractInput(
        binding: ControlSchemeServoBinding,
        globalInput: Dictionary<ControllerInputModel>
    ): BindingInputExtractionResult<ControlSchemeBindingType.Servo> {
        return {
            [ServoBindingInputAction.Cw]: this.getInputId(binding, ServoBindingInputAction.Cw, globalInput) ?? null,
            [ServoBindingInputAction.Ccw]: this.getInputId(binding, ServoBindingInputAction.Ccw, globalInput) ?? null,
        };
    }

    public isInputChanged(
        prevInput: BindingInputExtractionResult<ControlSchemeBindingType.Servo>,
        nextInput: BindingInputExtractionResult<ControlSchemeBindingType.Servo>
    ): boolean {
        return prevInput[ServoBindingInputAction.Cw] !== nextInput[ServoBindingInputAction.Cw]
            || prevInput[ServoBindingInputAction.Ccw] !== nextInput[ServoBindingInputAction.Ccw];
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
