import { Injectable } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MotorServoEndState } from 'rxpoweredup';
import { DeepPartial } from '@app/shared-misc';
import { ControlSchemeSetAngleBinding, SetAngleInputAction } from '@app/store';
import { ControlSchemeFormBuilderService } from '@app/shared-control-schemes';

import { CommonBindingsFormControlsBuilderService } from '../common';
import { SetAngleBindingForm } from './set-angle-binding-form';
import { IBindingFormBuilder } from '../i-binding-form-builder';

@Injectable()
export class SetAngleBindingFormBuilderService implements IBindingFormBuilder<SetAngleBindingForm> {
    constructor(
        private readonly formBuilder: FormBuilder,
        private commonFormControlBuilder: CommonBindingsFormControlsBuilderService,
        private readonly controlSchemeFormBuilder: ControlSchemeFormBuilderService
    ) {
    }

    public build(): SetAngleBindingForm {
        return this.formBuilder.group({
            inputs: this.formBuilder.group({
                [SetAngleInputAction.SetAngle]: this.commonFormControlBuilder.inputFormGroup()
            }),
            hubId: this.controlSchemeFormBuilder.hubIdControl(),
            portId: this.controlSchemeFormBuilder.portIdControl(),
            angle: this.commonFormControlBuilder.angleControl(),
            speed: this.commonFormControlBuilder.speedControl(),
            power: this.commonFormControlBuilder.powerControl(),
            endState: this.commonFormControlBuilder.servoEndStateControl(MotorServoEndState.hold),
            useAccelerationProfile: this.commonFormControlBuilder.toggleControl(),
            useDecelerationProfile: this.commonFormControlBuilder.toggleControl()
        });
    }

    public patchForm(
        form: SetAngleBindingForm,
        patch: DeepPartial<ControlSchemeSetAngleBinding>
    ): void {
        form.patchValue(patch);
    }
}
