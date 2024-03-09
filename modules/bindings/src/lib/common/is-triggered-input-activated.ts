import { ControlSchemeBindingType } from '@app/shared-misc';
import { ControlSchemeBinding, InputDirection } from '@app/store';

import { BindingInputExtractionResult } from '../i-binding-task-input-extractor';

export function isTriggeredInputActivated<T extends ControlSchemeBindingType>(
    activationDirection: InputDirection,
    inputAction: keyof (ControlSchemeBinding & { bindingType: T })['inputs'],
    currentInput: BindingInputExtractionResult<T>,
    prevInput: BindingInputExtractionResult<T>
): boolean {
    const isCurrentInputActivated = !!currentInput[inputAction]?.isActivated;
    if (!isCurrentInputActivated) {
        return false;
    }
    const isPrevInputActivated = !!prevInput[inputAction]?.isActivated;
    const expectedActivationSign = activationDirection === InputDirection.Positive ? 1 : -1;
    const isCurrentInputDirectionMatches =  Math.sign(currentInput[inputAction]?.value ?? 0) === expectedActivationSign;
    return isCurrentInputDirectionMatches && !isPrevInputActivated;
}
