import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { TranslocoPipe } from '@ngneat/transloco';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { ControlSchemeBindingType, ValidationMessagesDirective } from '@app/shared-misc';
import { HideOnSmallScreenDirective, ToggleControlComponent } from '@app/shared-ui';
import { ControlSchemeInputAction } from '@app/store';
import { BindingControlSelectHubComponent, BindingControlSelectIoComponent } from '@app/shared-control-schemes';

import {
    BindingControlOutputEndStateComponent,
    BindingControlPowerInputComponent,
    BindingControlSelectControllerComponent,
    BindingControlSelectControllerComponentData,
    BindingControlSpeedInputComponent,
    BindingEditSectionComponent,
    BindingEditSectionsContainerComponent,
    ControlSchemeInputActionToL10nKeyPipe
} from '../common';
import { IBindingsDetailsEditComponent } from '../i-bindings-details-edit-component';
import { StepperBindingForm } from './stepper-binding-form';
import { BINDING_CONTROLLER_NAME_RESOLVER } from '../i-binding-controller-name-resolver';
import { StepperControllerNameResolverService } from './stepper-controller-name-resolver.service';

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
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        { provide: BINDING_CONTROLLER_NAME_RESOLVER, useClass: StepperControllerNameResolverService }
    ]
})
export class BindingStepperEditComponent implements IBindingsDetailsEditComponent<StepperBindingForm> {
    public readonly bindingType = ControlSchemeBindingType.Stepper;

    private _stepControlBindingComponentData?: BindingControlSelectControllerComponentData<ControlSchemeBindingType.Stepper>;

    private _form?: StepperBindingForm;

    constructor(
        private readonly cdRef: ChangeDetectorRef
    ) {
    }

    public get form(): StepperBindingForm | undefined {
        return this._form;
    }

    public get stepControlBindingComponentData(): BindingControlSelectControllerComponentData<ControlSchemeBindingType.Stepper> | undefined {
        return this._stepControlBindingComponentData;

    }

    public setForm(
        form: StepperBindingForm
    ): void {
        if (form !== this._form) {
            this._form = form;
            this._stepControlBindingComponentData = {
                bindingType: ControlSchemeBindingType.Stepper,
                inputFormGroup: this._form.controls.inputs.controls[ControlSchemeInputAction.Step],
                inputAction: ControlSchemeInputAction.Step,
            };
            this.cdRef.detectChanges();
        }
    }
}
