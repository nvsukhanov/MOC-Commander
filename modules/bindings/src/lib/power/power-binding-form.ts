import { FormControl, FormGroup } from '@angular/forms';
import { PowerBindingInputAction } from '@app/store';

import { OptionalInputFormGroup } from '../common';

export type PowerBindingForm = FormGroup<{
  inputs: FormGroup<{
    [PowerBindingInputAction.Forwards]: OptionalInputFormGroup;
    [PowerBindingInputAction.Backwards]: OptionalInputFormGroup;
  }>;
  hubId: FormControl<string | null>;
  portId: FormControl<number | null>;
  modeId: FormControl<number | null>;
  maxPower: FormControl<number>;
  invert: FormControl<boolean>;
}>;
