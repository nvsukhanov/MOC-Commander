import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { ControlSchemeV2LinearBinding, ControlSchemeV2ServoBinding, ControlSchemeV2SetAngleBinding, ControlSchemeV2StepperBinding } from '@app/store';
import { HubIoOperationMode, ToFormGroup } from '@app/shared';

type BindingStateToFormGroup<T> = ToFormGroup<Omit<T, 'operationMode'>>;

export type LinearBindingForm = BindingStateToFormGroup<ControlSchemeV2LinearBinding>;
export type ServoBindingForm = BindingStateToFormGroup<ControlSchemeV2ServoBinding>;
export type StepperBindingForm = BindingStateToFormGroup<ControlSchemeV2StepperBinding>;
export type SetAngleBindingForm = BindingStateToFormGroup<ControlSchemeV2SetAngleBinding>;

export type ControlSchemeBindingForm = FormGroup<{
    bindingFormOperationMode: FormControl<HubIoOperationMode>;
    [HubIoOperationMode.Linear]: LinearBindingForm;
    [HubIoOperationMode.Servo]: ServoBindingForm;
    [HubIoOperationMode.Stepper]: StepperBindingForm;
    [HubIoOperationMode.SetAngle]: SetAngleBindingForm;
}>;

export type ControlSchemeEditForm = FormGroup<{
    id: FormControl<string>;
    name: FormControl<string>;
    bindings: FormArray<ControlSchemeBindingForm>;
}>;
