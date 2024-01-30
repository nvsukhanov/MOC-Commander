import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { MotorServoEndState } from 'rxpoweredup';
import { ControlSchemeInputAction, LoopingMode } from '@app/store';

import { InputFormGroup, OptionalInputFormGroup } from '../common';

export type GearboxControlBindingForm = FormGroup<{
    inputs: FormGroup<{
        [ControlSchemeInputAction.NextLevel]: InputFormGroup;
        [ControlSchemeInputAction.PrevLevel]: OptionalInputFormGroup;
        [ControlSchemeInputAction.Reset]: OptionalInputFormGroup;
    }>;
    hubId: FormControl<string | null>;
    portId: FormControl<number | null>;
    angles: FormArray<FormControl<number>>;
    power: FormControl<number>;
    speed: FormControl<number>;
    loopingMode: FormControl<LoopingMode>;
    endState: FormControl<MotorServoEndState>;
    useAccelerationProfile: FormControl<boolean>;
    useDecelerationProfile: FormControl<boolean>;
    initialLevelIndex: FormControl<number>;
}>;
