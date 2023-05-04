import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { ControlSchemeBindingInputForm } from './binding-input';
import { ControlSchemeBindingOutputForm } from './binding-output';

export type BindingForm = FormGroup<{
    id: FormControl<string>,
    input: ControlSchemeBindingInputForm,
    output: ControlSchemeBindingOutputForm
}>;

export type EditSchemeForm = FormGroup<{
    id: FormControl<string>,
    name: FormControl<string>,
    bindings: FormArray<BindingForm>
}>;
