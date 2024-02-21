import { ControlSchemeBinding, InputDirection } from '@app/store';
import { ControlSchemeBindingType } from '@app/shared-misc';

import { BindingInputExtractionResult } from '../i-binding-task-input-extractor';

export function isDirectionalInputActivated<T extends ControlSchemeBindingType>(
    activationDirection: InputDirection,
    inputAction: keyof (ControlSchemeBinding & { bindingType: T })['inputs'],
    currentInput: BindingInputExtractionResult<T>
): boolean {
    if (!currentInput[inputAction]?.isActivated) {
        return false;
    }
    const expectedActivationSign = activationDirection === InputDirection.Positive ? 1 : -1;
    return Math.sign(currentInput[inputAction]?.value ?? 0) === expectedActivationSign;
}
