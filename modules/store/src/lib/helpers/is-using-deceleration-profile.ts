import { ControlSchemeBindingType } from '@app/shared-misc';

import { ControlSchemeBinding } from '../models';

export function isUsingDecelerationProfile(binding: ControlSchemeBinding): boolean {
  switch (binding.bindingType) {
    case ControlSchemeBindingType.Accelerate:
    case ControlSchemeBindingType.Power:
      return false;
    case ControlSchemeBindingType.Gearbox:
    case ControlSchemeBindingType.Servo:
    case ControlSchemeBindingType.SetAngle:
    case ControlSchemeBindingType.Speed:
    case ControlSchemeBindingType.Stepper:
    case ControlSchemeBindingType.Train:
      return binding.useDecelerationProfile;
  }
}
