import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { MOTOR_LIMITS } from '@nvsukhanov/rxpoweredup';
import { TranslocoModule } from '@ngneat/transloco';
import { HubIoOperationMode, SliderControlComponent, ToggleControlComponent } from '@app/shared';

import { IBindingsDetailsEditComponent } from '../i-bindings-details-edit-component';
import { BindingControlNumInputComponent } from '../control-num-input';
import { BindingControlSelectControllerComponent } from '../control-select-controller';
import { BindingControlOutputEndStateComponent } from '../control-output-end-state-select';
import { SetAngleBindingForm } from '../types';
import { getInputTypesForOperationMode } from '../wait-for-controller-input-dialog/get-io-operation-modes-for-controller-input-type';

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
        ToggleControlComponent
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BindingSetAngleEditComponent implements IBindingsDetailsEditComponent<SetAngleBindingForm> {
    public readonly motorLimits = MOTOR_LIMITS;

    public readonly acceptableInputTypes = getInputTypesForOperationMode(HubIoOperationMode.SetAngle);

    private _form?: SetAngleBindingForm;

    constructor(
        private readonly cdRef: ChangeDetectorRef
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
}
