import { FormControl, FormGroup } from '@angular/forms';
import { ControlSchemeInputAction } from '@app/store';

import { InputFormGroup, OptionalInputFormGroup } from '../common';

export type SetSpeedBindingForm = FormGroup<{
    inputs: FormGroup<{
        [ControlSchemeInputAction.Accelerate]: InputFormGroup;
        [ControlSchemeInputAction.Brake]: OptionalInputFormGroup;
    }>;
    hubId: FormControl<string | null>;
    portId: FormControl<number | null>;
    maxSpeed: FormControl<number>;
    invert: FormControl<boolean>;
    power: FormControl<number>;
    useAccelerationProfile: FormControl<boolean>;
    useDecelerationProfile: FormControl<boolean>;
}>;
