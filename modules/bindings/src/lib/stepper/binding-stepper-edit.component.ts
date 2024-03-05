import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { TranslocoPipe } from '@ngneat/transloco';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { ControlSchemeBindingType, ValidationMessagesDirective } from '@app/shared-misc';
import { HideOnSmallScreenDirective, ToggleControlComponent } from '@app/shared-ui';
import { StepperInputAction } from '@app/store';
import { BindingControlSelectHubComponent, BindingControlSelectIoComponent } from '@app/shared-control-schemes';

import {
    BindingControlOutputEndStateComponent,
    BindingControlPowerInputComponent,
    BindingControlSelectControllerComponent,
    BindingControlSelectControllerComponentData,
    BindingControlSpeedInputComponent,
    BindingEditSectionComponent,
    BindingEditSectionsContainerComponent
} from '../common';
import { IBindingsDetailsEditComponent } from '../i-bindings-details-edit-component';
import { StepperBindingForm } from './stepper-binding-form';
import { StepperL10nService } from './stepper-l10n.service';

@Component({
    standalone: true,
    selector: 'lib-cs-binding-stepper-edit',
    templateUrl: './binding-stepper-edit.component.html',
    styleUrls: [ './binding-stepper-edit.component.scss' ],
    imports: [
        BindingEditSectionComponent,
        BindingControlSelectHubComponent,
        BindingControlSelectIoComponent,
        MatDividerModule,
        TranslocoPipe,
        BindingControlSelectControllerComponent,
        HideOnSmallScreenDirective,
        MatInputModule,
        BindingControlOutputEndStateComponent,
        ToggleControlComponent,
        ReactiveFormsModule,
        BindingEditSectionsContainerComponent,
        ValidationMessagesDirective,
        BindingControlSpeedInputComponent,
        BindingControlPowerInputComponent
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BindingStepperEditComponent implements IBindingsDetailsEditComponent<StepperBindingForm> {
    public readonly bindingType = ControlSchemeBindingType.Stepper;

    private _stepControlBindingComponentData: BindingControlSelectControllerComponentData<ControlSchemeBindingType.Stepper> | null = null;

    private _form?: StepperBindingForm;

    constructor(
        private readonly cdRef: ChangeDetectorRef,
        private readonly l10nService: StepperL10nService
    ) {
    }

    public get form(): StepperBindingForm | undefined {
        return this._form;
    }

    public get stepControlBindingComponentData(): BindingControlSelectControllerComponentData<ControlSchemeBindingType.Stepper> | null {
        return this._stepControlBindingComponentData;

    }

    public setForm(
        form: StepperBindingForm
    ): void {
        if (form !== this._form) {
            this._form = form;
            this._stepControlBindingComponentData = {
                bindingType: ControlSchemeBindingType.Stepper,
                inputFormGroup: this._form.controls.inputs.controls[StepperInputAction.Step],
                inputAction: StepperInputAction.Step,
                inputName$: this.l10nService.getBasicInputName(StepperInputAction.Step)
            };
            this.cdRef.detectChanges();
        }
    }
}
