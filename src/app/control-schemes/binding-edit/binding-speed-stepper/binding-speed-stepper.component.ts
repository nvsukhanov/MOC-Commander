import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgForOf, NgIf } from '@angular/common';
import { TranslocoModule } from '@ngneat/transloco';
import { MOTOR_LIMITS } from '@nvsukhanov/rxpoweredup';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ControlSchemeBindingType, ControllerInputType, SliderControlComponent, ToggleControlComponent } from '@app/shared';

import { IBindingsDetailsEditComponent } from '../i-bindings-details-edit-component';
import { SpeedStepperBindingForm } from '../types';
import { BindingControlSelectControllerComponent } from '../control-select-controller';
import { getInputTypesForOperationMode } from '../wait-for-controller-input-dialog/get-io-operation-modes-for-controller-input-type';
import { CommonFormControlsBuilderService } from '../forms';
import { BindingControlNumInputComponent } from '../control-num-input';

@Component({
    standalone: true,
    selector: 'app-binding-speed-stepper',
    templateUrl: './binding-speed-stepper.component.html',
    styleUrls: [ './binding-speed-stepper.component.scss' ],
    imports: [
        BindingControlSelectControllerComponent,
        NgIf,
        TranslocoModule,
        NgForOf,
        BindingControlNumInputComponent,
        MatButtonModule,
        MatIconModule,
        ToggleControlComponent,
        SliderControlComponent
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BindingSpeedStepperComponent implements IBindingsDetailsEditComponent<SpeedStepperBindingForm> {
    public readonly acceptableInputTypes: ControllerInputType[] = getInputTypesForOperationMode(ControlSchemeBindingType.SpeedStepper);

    public readonly motorLimits = MOTOR_LIMITS;

    private _form?: SpeedStepperBindingForm;

    constructor(
        private readonly commonFormControlBuilder: CommonFormControlsBuilderService
    ) {
    }

    public get form(): SpeedStepperBindingForm | undefined {
        return this._form;
    }

    public get isNextSpeedControlAssigned(): boolean {
        return this.form?.controls.inputs.controls.nextSpeed.controls.controllerId.value !== '';
    }

    public setForm(
        form: SpeedStepperBindingForm
    ): void {
        this._form = form;
    }

    public addNextSpeedControl(): void {
        if (!this._form) {
            return;
        }
        this._form.controls.steps.insert(
            0,
            this.commonFormControlBuilder.speedStepControl(MOTOR_LIMITS.maxSpeed)
        );
        this._form.controls.initialStepIndex.setValue(
            this._form.controls.initialStepIndex.value + 1
        );
        this._form.controls.steps.markAsTouched();
        this._form.controls.steps.markAsDirty();
        this._form.updateValueAndValidity();
    }

    public addPrevSpeedControl(): void {
        if (!this._form) {
            return;
        }
        this._form.controls.steps.push(
            this.commonFormControlBuilder.speedStepControl(MOTOR_LIMITS.minSpeed)
        );
        this._form.controls.steps.markAsTouched();
        this._form.controls.steps.markAsDirty();
        this._form.updateValueAndValidity();
    }

    public removeSpeedControl(
        index: number
    ): void {
        if (!this._form) {
            return;
        }
        this._form.controls.steps.removeAt(index);
        if (this._form.controls.initialStepIndex.value > index) {
            this._form.controls.initialStepIndex.setValue(
                this._form.controls.initialStepIndex.value - 1
            );
        }
    }
}
