import { FormControl, FormGroup } from '@angular/forms';
import { MotorServoEndState } from 'rxpoweredup';
import { StepperBindingInputAction } from '@app/store';

import { OptionalInputFormGroup } from '../common';

export type StepperBindingForm = FormGroup<{
    inputs: FormGroup<{
        [StepperBindingInputAction.Cw]: OptionalInputFormGroup;
        [StepperBindingInputAction.Ccw]: OptionalInputFormGroup;
    }>;
    hubId: FormControl<string | null>;
    portId: FormControl<number | null>;
    degree: FormControl<number>;
    speed: FormControl<number>;
    power: FormControl<number>;
    endState: FormControl<MotorServoEndState>;
    useAccelerationProfile: FormControl<boolean>;
    useDecelerationProfile: FormControl<boolean>;
}>;
