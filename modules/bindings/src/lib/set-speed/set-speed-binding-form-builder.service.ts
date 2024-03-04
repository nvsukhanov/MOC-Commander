import { Injectable } from '@angular/core';
import { AbstractControl, FormBuilder, ValidatorFn } from '@angular/forms';
import { DeepPartial } from '@app/shared-misc';
import { ControlSchemeInputAction, ControlSchemeSetSpeedBinding, ControllerInputModel } from '@app/store';
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
                [ControlSchemeInputAction.Forwards]: this.commonFormControlBuilder.optionalInputFormGroup(),
                [ControlSchemeInputAction.Backwards]: this.commonFormControlBuilder.optionalInputFormGroup(),
                [ControlSchemeInputAction.Brake]: this.commonFormControlBuilder.optionalInputFormGroup(),
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
        return (inputsGroup: AbstractControl<{
            [ControlSchemeInputAction.Forwards]: ControllerInputModel;
            [ControlSchemeInputAction.Backwards]: ControllerInputModel;
            [ControlSchemeInputAction.Brake]: ControllerInputModel;
        }>) => {
            const forwardsInput = inputsGroup.value[ControlSchemeInputAction.Forwards];
            const backwardsInput = inputsGroup.value[ControlSchemeInputAction.Backwards];
            const brakeInput = inputsGroup.value[ControlSchemeInputAction.Brake];

            if (forwardsInput?.controllerId === null && backwardsInput?.controllerId === null && brakeInput?.controllerId === null) {
                return { [NO_INPUTS_SET_SPEED_ERROR]: true };
            }
            return null;
        };
    }
}
