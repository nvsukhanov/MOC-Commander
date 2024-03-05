import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { LoopingMode, TrainControlInputAction } from '@app/store';

import { InputFormGroup, OptionalInputFormGroup } from '../common';

export type TrainControlBindingForm = FormGroup<{
    inputs: FormGroup<{
        [TrainControlInputAction.NextSpeed]: InputFormGroup;
        [TrainControlInputAction.PrevSpeed]: OptionalInputFormGroup;
        [TrainControlInputAction.Reset]: OptionalInputFormGroup;
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
