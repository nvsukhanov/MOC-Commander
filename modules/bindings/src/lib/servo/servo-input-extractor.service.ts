import { Dictionary } from '@ngrx/entity';
import { Injectable } from '@angular/core';
import { ControlSchemeBindingType } from '@app/shared-misc';
import { ControlSchemeInputAction, ControlSchemeServoBinding, ControllerInputModel, controllerInputIdFn } from '@app/store';

import { BindingInputExtractionResult, IBindingTaskInputExtractor } from '../i-binding-task-input-extractor';

@Injectable()
export class ServoInputExtractorService implements IBindingTaskInputExtractor<ControlSchemeBindingType.Servo> {
    public extractInput(
        binding: ControlSchemeServoBinding,
        globalInput: Dictionary<ControllerInputModel>
    ): BindingInputExtractionResult<ControlSchemeBindingType.Servo> {
        const servoInputId = controllerInputIdFn(binding.inputs[ControlSchemeInputAction.Servo]);
        const servoInputResult = globalInput[servoInputId];
        return {
            [ControlSchemeInputAction.Servo]: servoInputResult ?? null
        };
    }

    public isInputChanged(
        prevInput: BindingInputExtractionResult<ControlSchemeBindingType.Servo>,
        nextInput: BindingInputExtractionResult<ControlSchemeBindingType.Servo>
    ): boolean {
        return prevInput[ControlSchemeInputAction.Servo] !== nextInput[ControlSchemeInputAction.Servo];
    }
}
