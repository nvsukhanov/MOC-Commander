import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NgForOf, NgIf } from '@angular/common';
import { TranslocoModule } from '@ngneat/transloco';
import { MOTOR_LIMITS, PortModeName } from 'rxpoweredup';
import { BehaviorSubject, Observable } from 'rxjs';
import { PushPipe } from '@ngrx/component';
import { SliderControlComponent, ToggleControlComponent } from '@app/shared';
import { ControlSchemeInputAction } from '@app/store';

import { BindingControlSelectControllerComponent } from '../control-select-controller';
import { BindingControlNumInputComponent } from '../control-num-input';
import { AngleShiftBindingForm } from '../types';
import { IBindingsDetailsEditComponent } from '../i-bindings-details-edit-component';
import { BindingControlOutputEndStateComponent } from '../control-output-end-state-select';
import { CommonFormControlsBuilderService } from '../forms';
import { BindingControlReadMotorPositionComponent } from '../control-read-pos';
import { ControlSchemeInputActionToL10nKeyPipe } from '../../control-scheme-input-action-to-l10n-key.pipe';
import { BindingControlSelectLoopingModeComponent } from '../contorl-select-looping-mode';

@Component({
    standalone: true,
    selector: 'app-binding-angle-shift-edit',
    templateUrl: './binding-angle-shift-edit.component.html',
    styleUrls: [ './binding-angle-shift-edit.component.scss' ],
    imports: [
        BindingControlNumInputComponent,
        BindingControlSelectControllerComponent,
        MatButtonModule,
        MatIconModule,
        NgForOf,
        NgIf,
        SliderControlComponent,
        ToggleControlComponent,
        TranslocoModule,
        BindingControlOutputEndStateComponent,
        BindingControlReadMotorPositionComponent,
        PushPipe,
        ControlSchemeInputActionToL10nKeyPipe,
        BindingControlSelectLoopingModeComponent
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BindingAngleShiftEditComponent implements IBindingsDetailsEditComponent<AngleShiftBindingForm> {
    public readonly motorLimits = MOTOR_LIMITS;

    public readonly controlSchemeInputActions = ControlSchemeInputAction;

    public readonly minAngle = -(MOTOR_LIMITS.maxServoDegreesRange / 2);

    public readonly maxAngle = MOTOR_LIMITS.maxServoDegreesRange / 2;

    public readonly portModeNames = PortModeName;

    private _form?: AngleShiftBindingForm;

    private readonly _isQueryingPort$ = new BehaviorSubject<boolean>(false);

    constructor(
        private readonly commonFormControlBuilder: CommonFormControlsBuilderService
    ) {
    }

    public get form(): AngleShiftBindingForm | undefined {
        return this._form;
    }

    public get isNextAngleControlAssigned(): boolean {
        return this.form?.controls.inputs.controls[ControlSchemeInputAction.NextLevel].controls.controllerId.value !== '';
    }

    public get isQueryingPort$(): Observable<boolean> {
        return this._isQueryingPort$;
    }

    public setForm(
        form: AngleShiftBindingForm
    ): void {
        this._form = form;
    }

    public updateIsQueryingPort(
        isQuerying: boolean
    ): void {
        this._isQueryingPort$.next(isQuerying);
    }

    public onAngleRead(
        angle: number,
        at: number
    ): void {
        if (this.form === undefined
            || this.form.controls.hubId.value === undefined
            || this.form.controls.portId.value === undefined
        ) {
            return;
        }
        const control = this.form.controls.angles.at(at);

        control.setValue(angle);
        control.markAsTouched();
        control.markAsDirty();
        this.form?.updateValueAndValidity();
    }

    public addNextAngleLevel(): void {
        if (!this._form) {
            return;
        }
        this._form.controls.angles.insert(
            0,
            this.commonFormControlBuilder.angleSelectControl(0)
        );
        this._form.controls.initialStepIndex.setValue(
            this._form.controls.initialStepIndex.value + 1
        );
        this._form.controls.angles.markAsTouched();
        this._form.controls.angles.markAsDirty();
        this._form.updateValueAndValidity();
    }

    public addPrevAngleLevel(): void {
        if (!this._form) {
            return;
        }
        this._form.controls.angles.push(
            this.commonFormControlBuilder.angleSelectControl(0)
        );
        this._form.controls.angles.markAsTouched();
        this._form.controls.angles.markAsDirty();
        this._form.updateValueAndValidity();
    }

    public removeAngleLevel(
        index: number
    ): void {
        if (!this._form) {
            return;
        }
        this._form.controls.angles.removeAt(index);
        if (this._form.controls.initialStepIndex.value > index) {
            this._form.controls.initialStepIndex.setValue(
                this._form.controls.initialStepIndex.value - 1
            );
        }
    }
}
