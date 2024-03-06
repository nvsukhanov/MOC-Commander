import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { LoopingMode, TrainInputAction } from '@app/store';

import { InputFormGroup, OptionalInputFormGroup } from '../common';

export type TrainBindingForm = FormGroup<{
    inputs: FormGroup<{
        [TrainInputAction.NextSpeed]: InputFormGroup;
        [TrainInputAction.PrevSpeed]: OptionalInputFormGroup;
        [TrainInputAction.Reset]: OptionalInputFormGroup;
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
