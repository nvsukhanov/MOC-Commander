import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { TranslocoPipe } from '@ngneat/transloco';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { ControlSchemeBindingType, ValidationMessagesDirective } from '@app/shared-misc';
import { HideOnSmallScreenDirective, ToggleControlComponent } from '@app/shared-ui';
import { ControlSchemeInputAction } from '@app/store';

import { IBindingsDetailsEditComponent } from '../i-bindings-details-edit-component';
import {
    BindingControlOutputEndStateComponent,
    BindingControlPowerInputComponent,
    BindingControlSelectControllerComponent,
    BindingControlSelectHubComponent,
    BindingControlSelectIoComponent,
    BindingControlSpeedInputComponent
} from '../../controls';
import { BindingEditSectionComponent } from '../section';
import { BindingEditSectionsContainerComponent } from '../sections-container';
import { ControlSchemeInputActionToL10nKeyPipe } from '../../control-scheme-input-action-to-l10n-key.pipe';
import { StepperBindingForm } from '../../forms';

@Component({
    standalone: true,
    selector: 'lib-cs-binding-stepper-edit',
    templateUrl: './binding-stepper-edit.component.html',
    styleUrls: [ './binding-stepper-edit.component.scss' ],
    imports: [
        NgIf,
        BindingEditSectionComponent,
        BindingControlSelectHubComponent,
        BindingControlSelectIoComponent,
        MatDividerModule,
        TranslocoPipe,
        BindingControlSelectControllerComponent,
        ControlSchemeInputActionToL10nKeyPipe,
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
