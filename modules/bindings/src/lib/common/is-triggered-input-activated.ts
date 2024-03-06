import { ControlSchemeBindingType } from '@app/shared-misc';
import { ControlSchemeBinding, InputDirection } from '@app/store';

import { BindingInputExtractionResult } from '../i-binding-task-input-extractor';

export function isTriggeredInputActivated<T extends ControlSchemeBindingType>(
    activationDirection: InputDirection,
    inputAction: keyof (ControlSchemeBinding & { bindingType: T })['inputs'],
    currentInput: BindingInputExtractionResult<T>,
    prevInput: BindingInputExtractionResult<T>
): boolean {
    if (!currentInput[inputAction]?.isActivated) {
        return false;
    }
    const expectedActivationSign = activationDirection === InputDirection.Positive ? 1 : -1;
    const isCurrentInputActivated =  Math.sign(currentInput[inputAction]?.value ?? 0) === expectedActivationSign;
    const isPrevInputActivated = Math.sign(prevInput[inputAction]?.value ?? 0) === expectedActivationSign;
    return isCurrentInputActivated && !isPrevInputActivated;
}
