import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { ControlSchemeBindingType, ValidationErrorsL10nMap, ValidationMessagesDirective } from '@app/shared-misc';
import { HideOnSmallScreenDirective, ToggleControlComponent } from '@app/shared-components';
import { InputPipeType, StepperBindingInputAction } from '@app/store';
import { BindingControlSelectHubComponent, BindingControlSelectIoComponent } from '@app/shared-control-schemes';

import {
  BindingControlOutputEndStateComponent,
  BindingControlPowerInputComponent,
  BindingControlSelectControllerComponent,
  BindingControlSelectControllerComponentData,
  BindingControlSpeedInputComponent,
  BindingEditSectionComponent,
  BindingEditSectionsContainerComponent,
} from '../common';
import { IBindingsDetailsEditComponent } from '../i-bindings-details-edit-component';
import { StepperBindingForm } from './stepper-binding-form';
import { StepperBindingL10nService } from './stepper-binding-l10n.service';
import { NO_INPUTS_STEPPER_ERROR } from './stepper-binding-form-builder.service';

@Component({
  standalone: true,
  selector: 'lib-cs-stepper-binding-edit',
  templateUrl: './stepper-binding-edit.component.html',
  styleUrl: './stepper-binding-edit.component.scss',
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
    BindingControlPowerInputComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StepperBindingEditComponent implements IBindingsDetailsEditComponent<StepperBindingForm> {
  public readonly bindingType = ControlSchemeBindingType.Stepper;

  public readonly validationErrorsMap: ValidationErrorsL10nMap = {
    [NO_INPUTS_STEPPER_ERROR]: 'controlScheme.stepperBinding.missingInputs',
  };

  private _stepCwControlBindingComponentData: BindingControlSelectControllerComponentData<ControlSchemeBindingType.Stepper> | null = null;

  private _stepCcwControlBindingComponentData: BindingControlSelectControllerComponentData<ControlSchemeBindingType.Stepper> | null = null;

  private _form?: StepperBindingForm;

  constructor(
    private readonly cdRef: ChangeDetectorRef,
    private readonly l10nService: StepperBindingL10nService,
  ) {}

  public get form(): StepperBindingForm | undefined {
    return this._form;
  }

  public get stepCwControlBindingComponentData(): BindingControlSelectControllerComponentData<ControlSchemeBindingType.Stepper> | null {
    return this._stepCwControlBindingComponentData;
  }

  public get stepCcwControlBindingComponentData(): BindingControlSelectControllerComponentData<ControlSchemeBindingType.Stepper> | null {
    return this._stepCcwControlBindingComponentData;
  }

  public setForm(form: StepperBindingForm): void {
    if (form !== this._form) {
      this._form = form;
      this._stepCwControlBindingComponentData = {
        bindingType: ControlSchemeBindingType.Stepper,
        inputFormGroup: this._form.controls.inputs.controls[StepperBindingInputAction.Cw],
        inputAction: StepperBindingInputAction.Cw,
        inputName$: this.l10nService.getBasicInputName(StepperBindingInputAction.Cw),
        supportedInputPipes: [InputPipeType.Pulse],
      };
      this._stepCcwControlBindingComponentData = {
        bindingType: ControlSchemeBindingType.Stepper,
        inputFormGroup: this._form.controls.inputs.controls[StepperBindingInputAction.Ccw],
        inputAction: StepperBindingInputAction.Ccw,
        inputName$: this.l10nService.getBasicInputName(StepperBindingInputAction.Ccw),
        supportedInputPipes: [InputPipeType.Pulse],
      };
      this.cdRef.detectChanges();
    }
  }
}
