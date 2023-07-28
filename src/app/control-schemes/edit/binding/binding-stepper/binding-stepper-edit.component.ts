import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { MOTOR_LIMITS } from '@nvsukhanov/rxpoweredup';
import { HubIoOperationMode } from '@app/shared';
import { TranslocoModule } from '@ngneat/transloco';

import { IBindingsDetailsEditComponent } from '../i-bindings-details-edit-component';
import { StepperBindingForm } from '../../types';
import { BindingControlNumInputComponent } from '../control-num-input';
import { BindingControlSelectControllerComponent } from '../control-select-controller';
import { BindingControlSliderComponent } from '../control-slider';
import { BindingControlOutputEndStateComponent } from '../control-output-end-state-select';
import { BindingControlToggleComponent } from '../control-toggle';

@Component({
    standalone: true,
    selector: 'app-binding-stepper-edit',
    templateUrl: './binding-stepper-edit.component.html',
    styleUrls: [ './binding-stepper-edit.component.scss' ],
    imports: [
        NgIf,
        BindingControlSliderComponent,
        BindingControlNumInputComponent,
        BindingControlOutputEndStateComponent,
        BindingControlSelectControllerComponent,
        TranslocoModule,
        BindingControlToggleComponent
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

    public readonly stepperHubIoOperationMode = HubIoOperationMode.Stepper;

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