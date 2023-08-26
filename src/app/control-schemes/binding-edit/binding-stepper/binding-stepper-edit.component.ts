import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { MOTOR_LIMITS } from '@nvsukhanov/rxpoweredup';
import { TranslocoModule } from '@ngneat/transloco';
import { SliderControlComponent, ToggleControlComponent } from '@app/shared';

import { IBindingsDetailsEditComponent } from '../i-bindings-details-edit-component';
import { BindingControlNumInputComponent } from '../control-num-input';
import { BindingControlSelectControllerComponent } from '../control-select-controller';
import { BindingControlOutputEndStateComponent } from '../control-output-end-state-select';
import { StepperBindingForm } from '../types';

@Component({
    standalone: true,
    selector: 'app-binding-stepper-edit',
    templateUrl: './binding-stepper-edit.component.html',
    styleUrls: [ './binding-stepper-edit.component.scss' ],
    imports: [
        NgIf,
        SliderControlComponent,
        BindingControlNumInputComponent,
        BindingControlOutputEndStateComponent,
        BindingControlSelectControllerComponent,
        TranslocoModule,
        ToggleControlComponent
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BindingStepperEditComponent implements IBindingsDetailsEditComponent<StepperBindingForm> {
    public readonly minStepperDegree = -MOTOR_LIMITS.maxServoDegreesRange;

    public readonly maxStepperDegree = MOTOR_LIMITS.maxServoDegreesRange;

    public readonly minSpeed = 0;

    public readonly maxSpeed = MOTOR_LIMITS.maxSpeed;

    public readonly minPower = MOTOR_LIMITS.minPower;

    public readonly maxPower = MOTOR_LIMITS.maxPower;

    private _form?: StepperBindingForm;

    constructor(
        private readonly cdRef: ChangeDetectorRef
    ) {
    }

    public get form(): StepperBindingForm | undefined {
        return this._form;
    }

    public setForm(
        form: StepperBindingForm
    ): void {
        if (form !== this._form) {
            this._form = form;
            this.cdRef.detectChanges();
        }
    }
}
