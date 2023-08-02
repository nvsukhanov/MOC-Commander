import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { MOTOR_LIMITS } from '@nvsukhanov/rxpoweredup';
import { TranslocoModule } from '@ngneat/transloco';
import { HubIoOperationMode } from '@app/shared';

import { IBindingsDetailsEditComponent } from '../i-bindings-details-edit-component';
import { BindingControlNumInputComponent } from '../control-num-input';
import { BindingControlSelectControllerComponent } from '../control-select-controller';
import { BindingControlOutputEndStateComponent } from '../control-output-end-state-select';
import { BindingControlSliderComponent } from '../control-slider';
import { BindingControlToggleComponent } from '../control-toggle';
import { SetAngleBindingForm } from '../types';

@Component({
    standalone: true,
    selector: 'app-binding-set-angle-edit',
    templateUrl: './binding-set-angle-edit.component.html',
    styleUrls: [ './binding-set-angle-edit.component.scss' ],
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
export class BindingSetAngleEditComponent implements IBindingsDetailsEditComponent<SetAngleBindingForm> {
    public readonly motorLimits = MOTOR_LIMITS;

    public readonly setAngleHubIoOperationMode = HubIoOperationMode.SetAngle;

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
