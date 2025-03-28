import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { ButtonGroupButtonId } from 'rxpoweredup';
import { ControllerInputType } from '@app/controller-profiles';
import { InputDirection, InputPipeConfig } from '@app/store';

export type InputFormGroup = FormGroup<{
  controllerId: FormControl<string>;
  inputId: FormControl<string>;
  inputType: FormControl<ControllerInputType>;
  buttonId: FormControl<ButtonGroupButtonId | null>;
  portId: FormControl<number | null>;
  inputDirection: FormControl<InputDirection>;
  inputPipes: FormArray<FormControl<InputPipeConfig>>;
}>;

export type OptionalInputFormGroup = FormGroup<{
  controllerId: FormControl<string | null>;
  inputId: FormControl<string>;
  inputType: FormControl<ControllerInputType>;
  buttonId: FormControl<ButtonGroupButtonId | null>;
  portId: FormControl<number | null>;
  inputDirection: FormControl<InputDirection>;
  inputPipes: FormArray<FormControl<InputPipeConfig>>;
}>;
