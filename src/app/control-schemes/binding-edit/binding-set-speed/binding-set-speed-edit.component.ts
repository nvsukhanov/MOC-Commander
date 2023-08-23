import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { MOTOR_LIMITS } from '@nvsukhanov/rxpoweredup';
import { merge } from 'rxjs';
import { TranslocoModule } from '@ngneat/transloco';
import { ControlSchemeBindingType, ControllerInputType, SliderControlComponent, ToggleControlComponent } from '@app/shared';

import { IBindingsDetailsEditComponent } from '../i-bindings-details-edit-component';
import { BindingControlSelectControllerComponent } from '../control-select-controller';
import { SetSpeedBindingForm } from '../types';
import { BindingInputGainSelectComponent } from '../control-axial-output-modifier-select';
import { getInputTypesForOperationMode } from '../wait-for-controller-input-dialog/get-io-operation-modes-for-controller-input-type';

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
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BindingSetSpeedEditComponent implements IBindingsDetailsEditComponent<SetSpeedBindingForm> {
    public readonly motorLimits = MOTOR_LIMITS;

    public readonly accelerationInputTypes = getInputTypesForOperationMode(ControlSchemeBindingType.SetSpeed);

    public readonly brakeInputTypes: ControllerInputType[] = [
        ControllerInputType.Button,
        ControllerInputType.ButtonGroup,
        ControllerInputType.Trigger
    ];

    public form?: SetSpeedBindingForm;

    constructor(
        private readonly cd: ChangeDetectorRef,
    ) {
    }

    public get isAccelerationInputAssigned(): boolean {
        return this.form?.controls.inputs.controls.accelerate.controls.inputId.value !== undefined;
    }

    public get isToggleable(): boolean {
        const inputType = this.form?.controls.inputs.controls.accelerate.controls.inputType.value;
        return inputType === ControllerInputType.Button || inputType === ControllerInputType.ButtonGroup;
    }

    public get isInputGainConfigurable(): boolean {
        return this.form?.controls.inputs.controls.accelerate.controls.inputType.value === ControllerInputType.Axis
            || this.form?.controls.inputs.controls.accelerate.controls.inputType.value === ControllerInputType.Trigger;
    }

    public setForm(
        outputBinding: SetSpeedBindingForm
    ): void {
        const accelerateControls = outputBinding.controls.inputs.controls.accelerate.controls;
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
