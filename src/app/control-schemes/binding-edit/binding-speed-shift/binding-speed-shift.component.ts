import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgForOf, NgIf } from '@angular/common';
import { TranslocoModule } from '@ngneat/transloco';
import { MOTOR_LIMITS } from 'rxpoweredup';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SliderControlComponent, ToggleControlComponent } from '@app/shared';
import { ControlSchemeInputAction } from '@app/store';

import { IBindingsDetailsEditComponent } from '../i-bindings-details-edit-component';
import { SpeedShiftBindingForm } from '../types';
import { BindingControlSelectControllerComponent } from '../control-select-controller';
import { CommonFormControlsBuilderService } from '../forms';
import { BindingControlNumInputComponent } from '../control-num-input';
import { ControlSchemeInputActionToL10nKeyPipe } from '../../control-scheme-input-action-to-l10n-key.pipe';
import { BindingControlSelectLoopingModeComponent } from '../contorl-select-looping-mode';

@Component({
    standalone: true,
    selector: 'app-binding-speed-stepper',
    templateUrl: './binding-speed-shift.component.html',
    styleUrls: [ './binding-speed-shift.component.scss' ],
    imports: [
        BindingControlSelectControllerComponent,
        NgIf,
        TranslocoModule,
        NgForOf,
        BindingControlNumInputComponent,
        MatButtonModule,
        MatIconModule,
        ToggleControlComponent,
        SliderControlComponent,
        ControlSchemeInputActionToL10nKeyPipe,
        BindingControlSelectLoopingModeComponent
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BindingSpeedShiftComponent implements IBindingsDetailsEditComponent<SpeedShiftBindingForm> {
    public readonly motorLimits = MOTOR_LIMITS;

    public readonly controlSchemeInputActions = ControlSchemeInputAction;

    private _form?: SpeedShiftBindingForm;

    constructor(
        private readonly commonFormControlBuilder: CommonFormControlsBuilderService
    ) {
    }

    public get form(): SpeedShiftBindingForm | undefined {
        return this._form;
    }

    public get isNextSpeedControlAssigned(): boolean {
        return this.form?.controls.inputs.controls[ControlSchemeInputAction.NextLevel].controls.controllerId.value !== '';
    }

    public setForm(
        form: SpeedShiftBindingForm
    ): void {
        this._form = form;
    }

    public addNextSpeedControl(): void {
        if (!this._form) {
            return;
        }
        this._form.controls.levels.insert(
            0,
            this.commonFormControlBuilder.speedSelectControl(MOTOR_LIMITS.maxSpeed)
        );
        this._form.controls.initialStepIndex.setValue(
            this._form.controls.initialStepIndex.value + 1
        );
        this._form.controls.levels.markAsTouched();
        this._form.controls.levels.markAsDirty();
        this._form.updateValueAndValidity();
    }

    public addPrevSpeedControl(): void {
        if (!this._form) {
            return;
        }
        this._form.controls.levels.push(
            this.commonFormControlBuilder.speedSelectControl(MOTOR_LIMITS.minSpeed)
        );
        this._form.controls.levels.markAsTouched();
        this._form.controls.levels.markAsDirty();
        this._form.updateValueAndValidity();
    }

    public removeSpeedControl(
        index: number
    ): void {
        if (!this._form) {
            return;
        }
        this._form.controls.levels.removeAt(index);
        if (this._form.controls.initialStepIndex.value > index) {
            this._form.controls.initialStepIndex.setValue(
                this._form.controls.initialStepIndex.value - 1
            );
        }
    }
}
