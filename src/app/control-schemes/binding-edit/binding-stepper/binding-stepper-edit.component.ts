import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { MOTOR_LIMITS } from 'rxpoweredup';
import { TranslocoModule } from '@ngneat/transloco';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { ControlSchemeBindingType, HideOnSmallScreenDirective, SliderControlComponent, ToggleControlComponent, ValidationMessagesDirective } from '@app/shared';
import { ControlSchemeInputAction } from '@app/store';

import { IBindingsDetailsEditComponent } from '../i-bindings-details-edit-component';
import { BindingControlSelectControllerComponent } from '../control-select-controller';
import { BindingControlOutputEndStateComponent } from '../control-output-end-state-select';
import { ControlSchemeInputActionToL10nKeyPipe, StepperBindingForm } from '../../common';
import { BindingControlSelectHubComponent } from '../control-select-hub';
import { BindingControlSelectIoComponent } from '../control-select-io';
import { BindingEditSectionComponent } from '../section';
import { BindingEditSectionsContainerComponent } from '../sections-container';

@Component({
    standalone: true,
    selector: 'app-binding-stepper-edit',
    templateUrl: './binding-stepper-edit.component.html',
    styleUrls: [ './binding-stepper-edit.component.scss' ],
    imports: [
        NgIf,
        BindingEditSectionComponent,
        BindingControlSelectHubComponent,
        BindingControlSelectIoComponent,
        MatDividerModule,
        TranslocoModule,
        BindingControlSelectControllerComponent,
        ControlSchemeInputActionToL10nKeyPipe,
        HideOnSmallScreenDirective,
        MatInputModule,
        SliderControlComponent,
        BindingControlOutputEndStateComponent,
        ToggleControlComponent,
        ReactiveFormsModule,
        BindingEditSectionsContainerComponent,
        ValidationMessagesDirective
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BindingStepperEditComponent implements IBindingsDetailsEditComponent<StepperBindingForm> {
    public readonly bindingType = ControlSchemeBindingType.Stepper;

    public readonly minSpeed = 0;

    public readonly maxSpeed = MOTOR_LIMITS.maxSpeed;

    public readonly minPower = MOTOR_LIMITS.minPower;

    public readonly maxPower = MOTOR_LIMITS.maxPower;

    public readonly controlSchemeInputActions = ControlSchemeInputAction;

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
