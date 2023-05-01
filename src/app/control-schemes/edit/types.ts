import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { ControlSchemeBindingInputControl } from './binding-input';
import { ControlSchemeBindingOutputLinearControl } from './binding-output';

export type BindingForm = FormGroup<{
    id: FormControl<string>,
    input: ControlSchemeBindingInputControl,
    output: ControlSchemeBindingOutputLinearControl
}>;

export type EditSchemeForm = FormGroup<{
    name: FormControl<string>,
    bindings: FormArray<BindingForm>
}>;
