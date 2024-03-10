import { Injectable } from '@angular/core';
import { AbstractControl, FormBuilder, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MOTOR_LIMITS, MotorServoEndState } from 'rxpoweredup';
import { AppValidators } from '@app/shared-misc';
import { ControlSchemeStepperBinding, ControllerInputModel, StepperBindingInputAction } from '@app/store';
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
                [StepperBindingInputAction.Cw]: this.commonFormControlBuilder.optionalInputFormGroup(),
                [StepperBindingInputAction.Ccw]: this.commonFormControlBuilder.optionalInputFormGroup(),
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
        patch: ControlSchemeStepperBinding
    ): void {
        form.patchValue(patch);
        this.commonFormControlBuilder.patchInputPipes(
            form.controls.inputs.controls[StepperBindingInputAction.Cw].controls.inputPipes,
            patch.inputs[StepperBindingInputAction.Cw]?.inputPipes ?? []
        );
        this.commonFormControlBuilder.patchInputPipes(
            form.controls.inputs.controls[StepperBindingInputAction.Ccw].controls.inputPipes,
            patch.inputs[StepperBindingInputAction.Ccw]?.inputPipes ?? []
        );
    }

    private createInputsValidators(): ValidatorFn {
        const VALIDATOR = (inputsGroup: AbstractControl<{
            [StepperBindingInputAction.Cw]: ControllerInputModel;
            [StepperBindingInputAction.Ccw]: ControllerInputModel;
        }>): ValidationErrors | null => {
            const cwInput = inputsGroup.value[StepperBindingInputAction.Cw];
            const ccwInput = inputsGroup.value[StepperBindingInputAction.Ccw];
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
