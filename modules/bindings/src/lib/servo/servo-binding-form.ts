import { FormControl, FormGroup } from '@angular/forms';
import { ServoInputAction } from '@app/store';

import { OptionalInputFormGroup } from '../common';

export type ServoBindingForm = FormGroup<{
    inputs: FormGroup<{
        [ServoInputAction.Cw]: OptionalInputFormGroup;
        [ServoInputAction.Ccw]: OptionalInputFormGroup;
    }>;
    hubId: FormControl<string | null>;
    portId: FormControl<number | null>;
    calibrateOnStart: FormControl<boolean>;
    range: FormControl<number>;
    aposCenter: FormControl<number>;
    speed: FormControl<number>;
    power: FormControl<number>;
    invert: FormControl<boolean>;
    useAccelerationProfile: FormControl<boolean>;
    useDecelerationProfile: FormControl<boolean>;
}>;
