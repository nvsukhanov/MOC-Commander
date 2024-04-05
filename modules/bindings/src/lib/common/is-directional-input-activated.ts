import { ControlSchemeBinding, InputDirection, TaskInputs } from '@app/store';
import { ControlSchemeBindingType } from '@app/shared-misc';

export function isDirectionalInputActivated<T extends ControlSchemeBindingType>(
    activationDirection: InputDirection,
    inputAction: keyof (ControlSchemeBinding & { bindingType: T })['inputs'],
    currentInput: TaskInputs<T>
): boolean {
    if (!currentInput[inputAction]?.isActivated) {
        return false;
    }
    const expectedActivationSign = activationDirection === InputDirection.Positive ? 1 : -1;
    return Math.sign(currentInput[inputAction]?.value ?? 0) === expectedActivationSign;
}
