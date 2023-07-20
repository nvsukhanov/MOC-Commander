import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { MOTOR_LIMITS } from '@nvsukhanov/rxpoweredup';
import { TranslocoModule } from '@ngneat/transloco';
import { HubIoOperationMode } from '@app/shared';

import { ControllerSelectComponent, OutputConfigSliderControlComponent, OutputEndStateSelectorComponent, OutputNumInputControlComponent } from '../controls';
import { IBindingsSpecificsComponent } from '../../i-bindings-specifics-component';
import { SetAngleBindingForm } from '../../../types';

@Component({
    standalone: true,
    selector: 'app-set-angle-output-configuration-edit',
    templateUrl: './set-angle-output-configuration-edit.component.html',
    styleUrls: [ './set-angle-output-configuration-edit.component.scss' ],
    imports: [
        NgIf,
        OutputConfigSliderControlComponent,
        OutputNumInputControlComponent,
        OutputEndStateSelectorComponent,
        ControllerSelectComponent,
        TranslocoModule
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SetAngleOutputConfigurationEditComponent implements IBindingsSpecificsComponent<SetAngleBindingForm> {
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
