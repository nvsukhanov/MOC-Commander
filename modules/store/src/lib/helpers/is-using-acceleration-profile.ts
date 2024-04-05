import { ControlSchemeBindingType } from '@app/shared-misc';

import { ControlSchemeBinding } from '../models';

export function isUsingAccelerationProfile(
    binding: ControlSchemeBinding
): boolean {
    switch (binding.bindingType) {
        case ControlSchemeBindingType.Accelerate:
            return false;
        case ControlSchemeBindingType.Gearbox:
        case ControlSchemeBindingType.Servo:
        case ControlSchemeBindingType.SetAngle:
        case ControlSchemeBindingType.Speed:
        case ControlSchemeBindingType.Stepper:
        case ControlSchemeBindingType.Train:
            return binding.useAccelerationProfile;
    }
}
