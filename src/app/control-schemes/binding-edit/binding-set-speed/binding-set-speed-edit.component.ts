import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { MOTOR_LIMITS } from '@nvsukhanov/rxpoweredup';
import { merge } from 'rxjs';
import { TranslocoModule } from '@ngneat/transloco';
import { ControllerInputType, SliderControlComponent, ToggleControlComponent } from '@app/shared';
import { ControlSchemeInputAction } from '@app/store';

import { IBindingsDetailsEditComponent } from '../i-bindings-details-edit-component';
import { BindingControlSelectControllerComponent } from '../control-select-controller';
import { InputFormGroup, SetSpeedBindingForm } from '../types';
import { BindingInputGainSelectComponent } from '../control-axial-output-modifier-select';
import { ControlSchemeInputActionToL10nKeyPipe } from '../../control-scheme-input-action-to-l10n-key.pipe';

@Component({
    standalone: true,
    selector: 'app-binding-set-speed-edit',
    templateUrl: './binding-set-speed-edit.component.html',
    styleUrls: [ './binding-set-speed-edit.component.scss' ],
    imports: [
        NgIf,
        SliderControlComponent,
        ToggleControlComponent,
        BindingControlSelectControllerComponent,
        TranslocoModule,
        BindingInputGainSelectComponent,
        ControlSchemeInputActionToL10nKeyPipe,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BindingSetSpeedEditComponent implements IBindingsDetailsEditComponent<SetSpeedBindingForm> {
    public readonly motorLimits = MOTOR_LIMITS;

    public readonly controlSchemeInputActions = ControlSchemeInputAction;

    public form?: SetSpeedBindingForm;

    constructor(
        private readonly cd: ChangeDetectorRef,
    ) {
    }

    private get accelerationControl(): InputFormGroup | undefined {
        return this.form?.controls.inputs.controls[ControlSchemeInputAction.Accelerate];
    }

    public get isAccelerationInputAssigned(): boolean {
        return !!this.accelerationControl?.controls.inputId.value;
    }

    public get isToggleable(): boolean {
        const inputType = this.accelerationControl?.controls.inputType.value;
        return inputType === ControllerInputType.Button || inputType === ControllerInputType.ButtonGroup;
    }

    public get isInputGainConfigurable(): boolean {
        return this.accelerationControl?.controls.inputType.value === ControllerInputType.Axis
            || this.accelerationControl?.controls.inputType.value === ControllerInputType.Trigger;
    }

    public setForm(
        outputBinding: SetSpeedBindingForm
    ): void {
        const accelerateControls = outputBinding.controls.inputs.controls[ControlSchemeInputAction.Accelerate].controls;
        if (outputBinding !== this.form) {
            this.form = outputBinding;
            merge(
                accelerateControls.controllerId.valueChanges,
                accelerateControls.inputId.valueChanges,
                accelerateControls.inputType.valueChanges,
            ).subscribe(() => {
                this.cd.markForCheck();
            });
            this.cd.markForCheck();
        }
    }
}
