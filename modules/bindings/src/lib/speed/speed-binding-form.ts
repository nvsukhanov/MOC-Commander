import { FormControl, FormGroup } from '@angular/forms';
import { SpeedInputAction } from '@app/store';

import { OptionalInputFormGroup } from '../common';

export type SpeedBindingForm = FormGroup<{
    inputs: FormGroup<{
        [SpeedInputAction.Forwards]: OptionalInputFormGroup;
        [SpeedInputAction.Backwards]: OptionalInputFormGroup;
        [SpeedInputAction.Brake]: OptionalInputFormGroup;
    }>;
    hubId: FormControl<string | null>;
    portId: FormControl<number | null>;
    maxSpeed: FormControl<number>;
    invert: FormControl<boolean>;
    power: FormControl<number>;
    useAccelerationProfile: FormControl<boolean>;
    useDecelerationProfile: FormControl<boolean>;
}>;
