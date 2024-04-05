import { ControllerInputType, ControllerType, isAxialActivationThresholdReached, isButtonActivationThresholdReached } from '@app/controller-profiles';

import { ControllerInputModel, ControllerSettingsModel } from '../models';

export function isControllerInputActivated(
    inputModel: ControllerInputModel,
    controllerSettings: ControllerSettingsModel
): boolean {
    if (controllerSettings.ignoreInput) {
        return false;
    }
    switch (controllerSettings.controllerType) {
        case ControllerType.Keyboard:
            return isButtonActivationThresholdReached(inputModel.rawValue);
        case ControllerType.Gamepad:
            if (inputModel.inputType === ControllerInputType.Button || inputModel.inputType === ControllerInputType.Trigger) {
                return isButtonActivationThresholdReached(inputModel.rawValue, controllerSettings.buttonConfigs[inputModel.inputId]);
            }
            return isAxialActivationThresholdReached(inputModel.rawValue, controllerSettings.axisConfigs[inputModel.inputId]);
        case ControllerType.Hub:
            return isButtonActivationThresholdReached(inputModel.rawValue);
    }
}
