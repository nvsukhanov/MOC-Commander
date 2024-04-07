import { FormControl, FormGroup } from '@angular/forms';
import { SpeedBindingInputAction } from '@app/store';

import { OptionalInputFormGroup } from '../common';

export type AccelerateBindingForm = FormGroup<{
    inputs: FormGroup<{
        [SpeedBindingInputAction.Forwards]: OptionalInputFormGroup;
        [SpeedBindingInputAction.Backwards]: OptionalInputFormGroup;
        [SpeedBindingInputAction.Brake]: OptionalInputFormGroup;
    }>;
    forwardsSpeedIncrement: FormControl<number>;
    backwardsSpeedIncrement: FormControl<number>;
    decelerateSpeedDecrement: FormControl<number>;
    hubId: FormControl<string | null>;
    portId: FormControl<number | null>;
    maxSpeed: FormControl<number>;
    invert: FormControl<boolean>;
    power: FormControl<number>;
}>;
