import { FormControl, FormGroup } from '@angular/forms';
import { SetSpeedInputAction } from '@app/store';

import { OptionalInputFormGroup } from '../common';

export type SetSpeedBindingForm = FormGroup<{
    inputs: FormGroup<{
        [SetSpeedInputAction.Forwards]: OptionalInputFormGroup;
        [SetSpeedInputAction.Backwards]: OptionalInputFormGroup;
        [SetSpeedInputAction.Brake]: OptionalInputFormGroup;
    }>;
    hubId: FormControl<string | null>;
    portId: FormControl<number | null>;
    maxSpeed: FormControl<number>;
    invert: FormControl<boolean>;
    power: FormControl<number>;
    useAccelerationProfile: FormControl<boolean>;
    useDecelerationProfile: FormControl<boolean>;
}>;
