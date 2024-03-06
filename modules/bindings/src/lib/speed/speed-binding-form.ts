import { FormControl, FormGroup } from '@angular/forms';
import { SpeedBindingInputAction } from '@app/store';

import { OptionalInputFormGroup } from '../common';

export type SpeedBindingForm = FormGroup<{
    inputs: FormGroup<{
        [SpeedBindingInputAction.Forwards]: OptionalInputFormGroup;
        [SpeedBindingInputAction.Backwards]: OptionalInputFormGroup;
        [SpeedBindingInputAction.Brake]: OptionalInputFormGroup;
    }>;
    hubId: FormControl<string | null>;
    portId: FormControl<number | null>;
    maxSpeed: FormControl<number>;
    invert: FormControl<boolean>;
    power: FormControl<number>;
    useAccelerationProfile: FormControl<boolean>;
    useDecelerationProfile: FormControl<boolean>;
}>;
