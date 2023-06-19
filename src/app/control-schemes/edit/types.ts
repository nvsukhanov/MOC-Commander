import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { IOType } from '@nvsukhanov/rxpoweredup';

import { ControlSchemeBindingInputForm } from './binding-input';
import { ControlSchemeBindingOutputForm } from './binding-output';

export type BindingForm = FormGroup<{
    id: FormControl<string>,
    input: ControlSchemeBindingInputForm,
    output: ControlSchemeBindingOutputForm
}>;

export type VirtualPortsForm = FormGroup<{
    hubId: FormControl<string>,
    name: FormControl<string>,
    portIdA: FormControl<number>,
    ioAType: FormControl<IOType>,
    portIdB: FormControl<number>,
    ioBType: FormControl<IOType>
}>;

export type EditSchemeForm = FormGroup<{
    id: FormControl<string>,
    name: FormControl<string>,
    bindings: FormArray<BindingForm>,
    virtualPorts: FormArray<VirtualPortsForm>
}>;
