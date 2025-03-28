import { FormControl, FormGroup } from '@angular/forms';
import { MotorServoEndState } from 'rxpoweredup';
import { SetAngleBindingInputAction } from '@app/store';

import { InputFormGroup } from '../common';

export type SetAngleBindingForm = FormGroup<{
  inputs: FormGroup<{
    [SetAngleBindingInputAction.SetAngle]: InputFormGroup;
  }>;
  hubId: FormControl<string | null>;
  portId: FormControl<number | null>;
  angle: FormControl<number>;
  speed: FormControl<number>;
  power: FormControl<number>;
  endState: FormControl<MotorServoEndState>;
  useAccelerationProfile: FormControl<boolean>;
  useDecelerationProfile: FormControl<boolean>;
}>;
