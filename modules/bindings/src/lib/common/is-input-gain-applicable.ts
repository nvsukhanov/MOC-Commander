import { ControllerInputType } from '@app/controller-profiles';

export function isInputGainApplicable(
    inputType: ControllerInputType
): boolean {
    return inputType === ControllerInputType.Axis
        || inputType === ControllerInputType.Trigger;
}
