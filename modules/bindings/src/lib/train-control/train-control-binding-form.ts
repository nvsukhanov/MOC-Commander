import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { ControlSchemeInputAction, LoopingMode } from '@app/store';

import { InputFormGroup, OptionalInputFormGroup } from '../common';

export type TrainControlBindingForm = FormGroup<{
    inputs: FormGroup<{
        [ControlSchemeInputAction.NextLevel]: InputFormGroup;
        [ControlSchemeInputAction.PrevLevel]: OptionalInputFormGroup;
        [ControlSchemeInputAction.Reset]: OptionalInputFormGroup;
    }>;
    hubId: FormControl<string | null>;
    portId: FormControl<number | null>;
    levels: FormArray<FormControl<number>>;
    power: FormControl<number>;
    loopingMode: FormControl<LoopingMode>;
    useAccelerationProfile: FormControl<boolean>;
    useDecelerationProfile: FormControl<boolean>;
    initialLevelIndex: FormControl<number>;
}>;
