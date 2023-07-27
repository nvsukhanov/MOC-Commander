import { FormArray, FormControl, FormGroup } from '@angular/forms';
import {
    ControlSchemeLinearBinding,
    ControlSchemePortConfig,
    ControlSchemeServoBinding,
    ControlSchemeSetAngleBinding,
    ControlSchemeStepperBinding
} from '@app/store';
import { HubIoOperationMode, ToFormGroup } from '@app/shared';

type BindingStateToFormGroup<T> = ToFormGroup<Omit<T, 'operationMode'>>;

export type LinearBindingForm = BindingStateToFormGroup<ControlSchemeLinearBinding>;
export type ServoBindingForm = BindingStateToFormGroup<ControlSchemeServoBinding>;
export type StepperBindingForm = BindingStateToFormGroup<ControlSchemeStepperBinding>;
export type SetAngleBindingForm = BindingStateToFormGroup<ControlSchemeSetAngleBinding>;

export type ControlSchemeBindingForm = FormGroup<{
    bindingFormOperationMode: FormControl<HubIoOperationMode>;
    [HubIoOperationMode.Linear]: LinearBindingForm;
    [HubIoOperationMode.Servo]: ServoBindingForm;
    [HubIoOperationMode.Stepper]: StepperBindingForm;
    [HubIoOperationMode.SetAngle]: SetAngleBindingForm;
}>;

export type ControlSchemePortConfigForm = ToFormGroup<ControlSchemePortConfig>;

export type ControlSchemeEditForm = FormGroup<{
    id: FormControl<string>;
    name: FormControl<string>;
    portConfigs: FormArray<ControlSchemePortConfigForm>;
    bindings: FormArray<ControlSchemeBindingForm>;
}>;
