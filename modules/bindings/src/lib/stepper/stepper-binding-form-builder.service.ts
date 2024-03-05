import { Injectable } from '@angular/core';
import { AbstractControl, FormBuilder, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MOTOR_LIMITS, MotorServoEndState } from 'rxpoweredup';
import { AppValidators, DeepPartial } from '@app/shared-misc';
import { ControlSchemeStepperBinding, ControllerInputModel, StepperInputAction } from '@app/store';
import { ControlSchemeFormBuilderService } from '@app/shared-control-schemes';

import { CommonBindingsFormControlsBuilderService } from '../common';
import { StepperBindingForm } from './stepper-binding-form';
import { IBindingFormBuilder } from '../i-binding-form-builder';

export const NO_INPUTS_STEPPER_ERROR = 'NO_INPUTS_STEPPER_ERROR';

@Injectable()
export class StepperBindingFormBuilderService implements IBindingFormBuilder<StepperBindingForm> {
    private readonly defaultStepDegree = 90;

    private readonly maxStepDegree = 360 * 4;

    constructor(
        private readonly formBuilder: FormBuilder,
        private commonFormControlBuilder: CommonBindingsFormControlsBuilderService,
        private readonly controlSchemeFormBuilder: ControlSchemeFormBuilderService
    ) {
    }

    public build(): StepperBindingForm {
        return this.formBuilder.group({
            inputs: this.formBuilder.group({
                [StepperInputAction.Cw]: this.commonFormControlBuilder.optionalInputFormGroup(),
                [StepperInputAction.Ccw]: this.commonFormControlBuilder.optionalInputFormGroup(),
            }, {
                validators: this.createInputsValidators()
            }),
            hubId: this.controlSchemeFormBuilder.hubIdControl(),
            portId: this.controlSchemeFormBuilder.portIdControl(),
            degree: this.formBuilder.control<number>(this.defaultStepDegree, {
                nonNullable: true,
                validators: [
                    Validators.required,
                    Validators.min(MOTOR_LIMITS.minServoDegreesRange),
                    Validators.max(this.maxStepDegree),
                    AppValidators.requireInteger
                ]
            }),
            power: this.commonFormControlBuilder.powerControl(),
            speed: this.commonFormControlBuilder.speedControl(),
            endState: this.commonFormControlBuilder.servoEndStateControl(MotorServoEndState.hold),
            useAccelerationProfile: this.commonFormControlBuilder.toggleControl(),
            useDecelerationProfile: this.commonFormControlBuilder.toggleControl()
        });
    }

    public patchForm(
        form: StepperBindingForm,
        patch: DeepPartial<ControlSchemeStepperBinding>
    ): void {
        form.patchValue(patch);
    }

    private createInputsValidators(): ValidatorFn {
        const VALIDATOR = (inputsGroup: AbstractControl<{
            [StepperInputAction.Cw]: ControllerInputModel;
            [StepperInputAction.Ccw]: ControllerInputModel;
        }>): ValidationErrors | null => {
            const cwInput = inputsGroup.value[StepperInputAction.Cw];
            const ccwInput = inputsGroup.value[StepperInputAction.Ccw];
            if (cwInput?.controllerId === null && ccwInput?.controllerId === null) {
                return { [NO_INPUTS_STEPPER_ERROR]: true };
            }
            return null;
        };
        // ValidatorFn expects an AbstractControl as the first argument, which is not typed, but it is a subclass of FormGroup
        // So we can safely cast it to ValidatorFn and keep the type safety
        return VALIDATOR as ValidatorFn;
    }
}
