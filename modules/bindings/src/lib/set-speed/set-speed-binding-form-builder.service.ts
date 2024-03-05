import { Injectable } from '@angular/core';
import { FormBuilder, ValidationErrors, ValidatorFn } from '@angular/forms';
import { DeepPartial } from '@app/shared-misc';
import { ControlSchemeSetSpeedBinding, SetSpeedInputAction } from '@app/store';
import { ControlSchemeFormBuilderService } from '@app/shared-control-schemes';

import { CommonBindingsFormControlsBuilderService } from '../common';
import { IFormBuilder } from '../i-form-builder';
import { SetSpeedBindingForm } from './set-speed-binding-form';

export const NO_INPUTS_SET_SPEED_ERROR = 'NO_SET_SPEED_INPUTS_ERROR';

@Injectable()
export class SetSpeedBindingFormBuilderService implements IFormBuilder<SetSpeedBindingForm> {
    constructor(
        private readonly formBuilder: FormBuilder,
        private commonFormControlBuilder: CommonBindingsFormControlsBuilderService,
        private readonly controlSchemeFormBuilder: ControlSchemeFormBuilderService
    ) {
    }

    public build(): SetSpeedBindingForm {
        return this.formBuilder.group({
            inputs: this.formBuilder.group({
                [SetSpeedInputAction.Forwards]: this.commonFormControlBuilder.optionalInputFormGroup(),
                [SetSpeedInputAction.Backwards]: this.commonFormControlBuilder.optionalInputFormGroup(),
                [SetSpeedInputAction.Brake]: this.commonFormControlBuilder.optionalInputFormGroup(),
            }, {
                validators: this.createInputsValidators()
            }),
            hubId: this.controlSchemeFormBuilder.hubIdControl(),
            portId: this.controlSchemeFormBuilder.portIdControl(),
            maxSpeed: this.commonFormControlBuilder.speedControl(),
            invert: this.commonFormControlBuilder.toggleControl(),
            power: this.commonFormControlBuilder.powerControl(),
            useAccelerationProfile: this.commonFormControlBuilder.toggleControl(),
            useDecelerationProfile: this.commonFormControlBuilder.toggleControl()
        });
    }

    public patchForm(
        form: SetSpeedBindingForm,
        patch: DeepPartial<ControlSchemeSetSpeedBinding>
    ): void {
        form.patchValue(patch);
    }

    private createInputsValidators(): ValidatorFn {
        const VALIDATOR = (inputsGroup: SetSpeedBindingForm['controls']['inputs']): ValidationErrors | null => {
            const forwards = inputsGroup.value[SetSpeedInputAction.Forwards];
            const backwards = inputsGroup.value[SetSpeedInputAction.Backwards];
            const brake = inputsGroup.value[SetSpeedInputAction.Brake];

            if (forwards?.controllerId === null && backwards?.controllerId === null && brake?.controllerId === null) {
                return { [NO_INPUTS_SET_SPEED_ERROR]: true };
            }
            return null;
        };
        // ValidatorFn expects an AbstractControl as the first argument, which is not typed, but it is a subclass of FormGroup
        // So we can safely cast it to ValidatorFn and keep the type safety
        return VALIDATOR as ValidatorFn;
    }
}
