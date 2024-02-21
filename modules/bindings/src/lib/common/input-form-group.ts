import { FormControl, FormGroup } from '@angular/forms';
import { ButtonGroupButtonId } from 'rxpoweredup';
import { ControllerInputType } from '@app/controller-profiles';
import { InputDirection, InputGain } from '@app/store';

export type InputFormGroup = FormGroup<{
    controllerId: FormControl<string>;
    inputId: FormControl<string>;
    inputType: FormControl<ControllerInputType>;
    gain: FormControl<InputGain>;
    buttonId: FormControl<ButtonGroupButtonId | null>;
    portId: FormControl<number | null>;
    inputDirection: FormControl<InputDirection>;
}>;

export type OptionalInputFormGroup = FormGroup<{
    controllerId: FormControl<string | null>;
    inputId: FormControl<string>;
    inputType: FormControl<ControllerInputType>;
    gain: FormControl<InputGain>;
    buttonId: FormControl<ButtonGroupButtonId | null>;
    portId: FormControl<number | null>;
    inputDirection: FormControl<InputDirection>;
}>;
