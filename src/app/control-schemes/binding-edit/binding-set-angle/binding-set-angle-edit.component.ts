import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { MOTOR_LIMITS, PortModeName } from '@nvsukhanov/rxpoweredup';
import { TranslocoModule } from '@ngneat/transloco';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PushPipe } from '@ngrx/component';
import { Store } from '@ngrx/store';
import { take } from 'rxjs';
import { ControlSchemeBindingType, SliderControlComponent, ToggleControlComponent } from '@app/shared';
import { ATTACHED_IO_PROPS_SELECTORS } from '@app/store';

import { IBindingsDetailsEditComponent } from '../i-bindings-details-edit-component';
import { BindingControlNumInputComponent } from '../control-num-input';
import { BindingControlSelectControllerComponent } from '../control-select-controller';
import { BindingControlOutputEndStateComponent } from '../control-output-end-state-select';
import { SetAngleBindingForm } from '../types';
import { getInputTypesForOperationMode } from '../wait-for-controller-input-dialog/get-io-operation-modes-for-controller-input-type';
import { BindingControlReadMotorPositionComponent } from '../control-read-pos';

@Component({
    standalone: true,
    selector: 'app-binding-set-angle-edit',
    templateUrl: './binding-set-angle-edit.component.html',
    styleUrls: [ './binding-set-angle-edit.component.scss' ],
    imports: [
        NgIf,
        SliderControlComponent,
        BindingControlNumInputComponent,
        BindingControlOutputEndStateComponent,
        BindingControlSelectControllerComponent,
        TranslocoModule,
        ToggleControlComponent,
        MatButtonModule,
        MatIconModule,
        PushPipe,
        BindingControlReadMotorPositionComponent
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BindingSetAngleEditComponent implements IBindingsDetailsEditComponent<SetAngleBindingForm> {
    public readonly motorLimits = MOTOR_LIMITS;

    public readonly acceptableInputTypes = getInputTypesForOperationMode(ControlSchemeBindingType.SetAngle);

    public readonly portModeNames = PortModeName;

    private _form?: SetAngleBindingForm;

    constructor(
        private readonly cdRef: ChangeDetectorRef,
        private readonly store: Store
    ) {
    }

    public get form(): SetAngleBindingForm | undefined {
        return this._form;
    }

    public setForm(
        form: SetAngleBindingForm
    ): void {
        if (form !== this._form) {
            this._form = form;
            this.cdRef.detectChanges();
        }
    }

    public onAngleRead(
        response: number
    ): void {
        if (this.form === undefined
            || this.form.controls.hubId.value === undefined
            || this.form.controls.portId.value === undefined
        ) {
            return;
        }
        const hubId = this.form.controls.hubId.value;
        const portId = this.form.controls.portId.value;

        this.store.select(ATTACHED_IO_PROPS_SELECTORS.selectMotorEncoderOffset({ hubId, portId })).pipe(
            take(1)
        ).subscribe((offset) => {
            this.form?.controls.angle.setValue(response + offset);
        });
    }
}
