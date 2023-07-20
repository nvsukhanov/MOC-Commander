import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { MOTOR_LIMITS } from '@nvsukhanov/rxpoweredup';
import { HubIoOperationMode } from '@app/shared';
import { TranslocoModule } from '@ngneat/transloco';

import { ControllerSelectComponent, OutputConfigSliderControlComponent, OutputEndStateSelectorComponent, OutputNumInputControlComponent } from '../controls';
import { IBindingsSpecificsComponent } from '../../i-bindings-specifics-component';
import { StepperBindingForm } from '../../../types';

@Component({
    standalone: true,
    selector: 'app-stepper-output-configuration-edit',
    templateUrl: './stepper-output-configuration-edit.component.html',
    styleUrls: [ './stepper-output-configuration-edit.component.scss' ],
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
export class StepperOutputConfigurationEditComponent implements IBindingsSpecificsComponent<StepperBindingForm> {
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
