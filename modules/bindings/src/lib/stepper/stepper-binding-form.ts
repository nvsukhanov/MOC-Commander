import { FormControl, FormGroup } from '@angular/forms';
import { MotorServoEndState } from 'rxpoweredup';
import { ControlSchemeInputAction } from '@app/store';

import { InputFormGroup } from '../common';

export type StepperBindingForm = FormGroup<{
    inputs: FormGroup<{
        [ControlSchemeInputAction.Step]: InputFormGroup;
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
